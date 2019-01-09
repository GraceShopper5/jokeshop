const router = require('express').Router()
const {Product} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const jokes = await Product.findAll()
    res.json(jokes)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const joke = await Product.findById(req.params.id)
    res.json(joke)
  } catch (err) {
    next(err)
  }
})
