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

router.post('/', async (req, res, next) => {
  try {
    const {purchaseDate, addressId, products} = req.body
    const newGuestOrder = await Order.create({
      purchaseDate,
      addressId,
      isPurchased: true
    })
    const newOrderItems = await products.map(async product => {
      await newGuestOrder.addProduct(product.id, {
        through: {
          pricePaid: product.currentPrice,
          quantity: product.OrderItem.quantity
        }
      })
    })
    res.json({newGuestOrder, newOrderItems})
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    const orderItems = await OrderItem.findAll({where: {orderId: order.id}})
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
