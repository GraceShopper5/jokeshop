const router = require('express').Router()
const {User, Order, OrderItem} = require('../db/models')
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
    const {product, quantity, overwrite} = req.body
    const shoppingCart = await User.getUserShoppingCart(req.params.id)
    const [orderItem, wasCreated] = await OrderItem.findOrCreate({
      where: {orderId: shoppingCart.id, productId: product.id}
    })
    if (!wasCreated) {
      orderItem.quantity = overwrite
        ? Number(quantity)
        : orderItem.quantity + Number(quantity)
    } else {
      orderItem.quantity = Number(quantity)
    }
    const updatedOrderItem = await orderItem.save()
    res.json(updatedOrderItem)
  } catch (err) {
    next(err)
  }
})
