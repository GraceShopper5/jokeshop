const router = require('express').Router()
const {Address} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (req.session.userIsAdmin) {
      const addresses = await Address.findAll()
      res.json(addresses)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {streetAddress, city, state, zipCode} = req.body
    const [newAddress, wasCreated] = await Address.findOrCreate({
      streetAddress,
      city,
      state,
      zipCode
    })
    res.json(newAddress)
  } catch (err) {
    next(err)
  }
})
