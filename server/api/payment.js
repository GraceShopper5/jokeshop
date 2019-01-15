const router = require('express').Router()
const {User, Order, OrderItem, Product} = require('../db/models')
module.exports = router
const configureStripe = require('stripe')

// test
const STRIPE_SECRET_KEY = 'sk_test_nXDA7mqSu02NoeN5uqNAeORO'

// live
// const STRIPE_SECRET_KEY = 'sk_live_MY_SECRET_KEY';

const stripe = configureStripe(STRIPE_SECRET_KEY)

const postStripeCharge = res => (stripeErr, stripeRes) => {
  if (stripeErr) {
    res.status(500).send({error: stripeErr})
  } else {
    res.status(200).send({success: stripeRes})
  }
}

router.get('/', (req, res) => {
  res.send({
    message: 'Hello Stripe checkout server!',
    timestamp: new Date().toISOString()
  })
})

router.post('/', (req, res) => {
  stripe.charges.create(req.body, postStripeCharge(res))
})
