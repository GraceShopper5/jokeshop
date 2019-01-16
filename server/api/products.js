const router = require('express').Router()
const {Product, Review, User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    res.json(product)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/reviews', async (req, res, next) => {
  try {
    const result = await Product.findOne({
      where: {id: req.params.id},
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName']
        }
      ]
    })
    //this looks like it doesn't make sense, but this is where the reviews show up due to eager loading
    const reviews = result.users
    res.json(reviews)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/reviews', async (req, res, next) => {
  try {
    const newReview = await Review.create({
      content: req.body.content,
      userId: req.user.id,
      productId: req.params.id
    })
    res.json({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      Review: newReview
    })
  } catch (err) {
    next(err)
  }
})
