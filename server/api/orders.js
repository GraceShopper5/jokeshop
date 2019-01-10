const router = require('express').Router()
const {Order, Product, OrderItem} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (req.session.userIsAdmin) {
      const orders = await Order.findAll()
      res.json(orders)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    const orderItems = await OrderItem.findAll({where: {orderId: order.id}})
    //    {
    //   include: [{model: OrderItem}],
    //   where: {orderId: req.params.id}
    // })
    if (
      (req.session.userId && req.session.userId === order.userId) ||
      req.session.userIsAdmin
    ) {
      res.json({order, orderItems})
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const newOrderItem = await OrderItem.create({
      productId: req.body.product.id,
      pricePaid: req.body.product.price,
      quantity: req.body.quantity,
      orderId: req.params.id
    })
    res.json(newOrderItem)
  } catch (err) {
    next(err)
  }
})
