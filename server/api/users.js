const router = require('express').Router()
const {User} = require('../db/models')
const {Order} = require('../db/models/order')
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
      (req.session.userId && req.session.userId == req.params.id) ||
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
      (req.session.userId && req.session.userId == req.params.id) ||
      req.session.userIsAdmin
    ) {
      const orders = await Order.findAll(req.params.id, {
        where: {
          id: req.params.id,
          isPurchased: true
        }
      })
      res.json(orders)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})
