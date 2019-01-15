const router = require('express').Router()
const {User, Order, OrderItem, Address, Product} = require('../db/models')
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (req.session.userIsAdmin) {
      const users = await User.findAll({
        attributes: ['id', 'email', 'firstName', 'lastName']
      })
      res.json(users)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (
      (req.session.userId && req.session.userId === Number(req.params.id)) ||
      req.session.userIsAdmin
    ) {
      const user = await User.findById(req.params.id, {
        attributes: ['id', 'email', 'firstName', 'lastName']
      })
      res.json(user)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id/order-history', async (req, res, next) => {
  try {
    if (
      (req.session.userId && req.session.userId === Number(req.params.id)) ||
      req.session.userIsAdmin
    ) {
      // const orders = await Order.findAll({
      //   where: {
      //     userId: req.params.id,
      //     isPurchased: true
      //   }
      // })
      const user = await User.findById(req.params.id)
      const orderHistory = await user.getOrderHistory()
      res.json(orderHistory)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id/shopping-cart', async (req, res, next) => {
  try {
    if (
      (req.session.userId && req.session.userId === Number(req.params.id)) ||
      req.session.userIsAdmin
    ) {
      const user = await User.findById(req.params.id)
      const cart = await user.getShoppingCart()
      res.json(cart)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})

router.put('/:id/shopping-cart', async (req, res, next) => {
  try {
    const {
      productId,
      quantity,
      overwrite,
      purchase,
      purchaseDate,
      addressId
    } = req.body
    const shoppingCart = await User.getUserShoppingCart(req.params.id)
    if (purchase) {
      await shoppingCart.update({isPurchased: true, purchaseDate, addressId})
      shoppingCart.products.forEach(async product => {
        product.OrderItem.pricePaid = product.currentPrice
        await product.OrderItem.save()
      })
      const newShoppingCart = await Order.createUserOrder(req.params.id, false)
      res.json(newShoppingCart)
    } else {
      const [orderItem, wasCreated] = await OrderItem.findOrCreate({
        where: {orderId: shoppingCart.id, productId}
      })
      if (!wasCreated) {
        orderItem.quantity = overwrite
          ? Number(quantity)
          : orderItem.quantity + Number(quantity)
      } else {
        orderItem.quantity = Number(quantity)
      }
      await orderItem.save()
      const updatedShoppingCart = await User.getUserShoppingCart(req.params.id)
      res.json(updatedShoppingCart)
    }
  } catch (err) {
    next(err)
  }
})

router.post('/:id/addresses', async (req, res, next) => {
  try {
    const {streetAddress, city, state, zipCode} = req.body
    const address = await Address.create({
      streetAddress,
      city,
      state,
      zipCode,
      userId: req.params.id
    })
    res.json(address)
  } catch (err) {
    next(err)
  }
})

router.post('/charge', async (req, res, next) => {
  let items, thisOrder, cart
  try {
    const products = await Product.findAll()
    if (
      (req.session.userId && req.session.userId === req.userId) ||
      req.session.userIsAdmin
    ) {
      thisOrder = await Order.findOne({
        where: {
          userId: req.session.userId,
          isPurchased: false
        }
      })
      items = await OrderItem.findAll({where: {orderId: thisOrder.id}})
      console.log(products)
    } else {
      cart = JSON.parse(localStorage.getItem('cart').products)
      thisOrder = await Order.create()
      items = cart.map(elem => {
        return {
          pricePaid: products.filter(item => item.id === elem.productId)[0]
            .currentPrice,
          quantity: elem.quantity,
          orderId: thisOrder.id,
          productId: elem.productId
        }
      })
      await OrderItem.bulkCreate(items)
    }
    const totalCost = items.reduce((acc, cur) => {
      const curItem = products.filter(item => item.id === cur.productId)
      acc += cur.quantity * curItem[0].currentPrice
      return acc
    }, 0)

    console.log('cart', cart.products)
    // const amount = ;

    let {status} = await stripe.charges.create({
      amount: totalCost / 100,
      currency: 'usd',
      description: `JokeShop Order ${thisOrder.id}`,
      source: req.body
    })
    res.json({status})
  } catch (err) {
    res.status(500)
    next(err)
  }
})
