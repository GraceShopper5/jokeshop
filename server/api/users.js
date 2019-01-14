const router = require('express').Router()
const { User, Order, OrderItem } = require('../db/models')
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')
// const stripe = require("stripe")("pk_test_sgAizXIzyMiJy3bIT2C5N5D6");
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
    const { productId, quantity, overwrite, purchase } = req.body
    const shoppingCart = await User.getUserShoppingCart(req.params.id)
    if (purchase) {
      await shoppingCart.update({ isPurchased: true })
      shoppingCart.products.forEach(product => {
        product.OrderItem.pricePaid = product.currentPrice
        product.OrderItem.save()
      })
      const newShoppingCart = await Order.createUserOrder(req.params.id, false)
      res.json(newShoppingCart)
    } else {
      const [orderItem, wasCreated] = await OrderItem.findOrCreate({
        where: { orderId: shoppingCart.id, productId }
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

router.post('/:id/charge', async (req, res, next) => {
  try {
    let cart
    if (
      (req.session.userId && req.session.userId === Number(req.params.id)) ||
      req.session.userIsAdmin
    ) {
      console.log('did this run? before user')
      const user = await User.findById(req.session.userId)
      console.log('did this run? after user')
      console.log('user', user)
      cart = await user.getShoppingCart()
      console.log('did this run? after cart')
      console.log('cart', cart)
    }
    // } else {
    //   cart = JSON.parse(localStorage.getItem('cart'))
    // }

    // console.log('cart', cart.products)
    // // const amount = ;

    // let { status } = await stripe.charges.create({
    //   amount: 2000,
    //   currency: 'usd',
    //   description: 'An example charge',
    //   source: req.body
    // })
    // console.log('body', req.body)
    // res.json({ status })
    // console.log('status', status)
    res.json('hello')
  } catch (err) {
    res.status(500)
    next(err)
  }
})