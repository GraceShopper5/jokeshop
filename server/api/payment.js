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

// router.post('/charge', async (req, res, next) => {
//     let items, thisOrder, cart
//     try {
//         const products = await Product.findAll()
//         if (
//             (req.session.userId && req.session.userId === req.userId) ||
//             req.session.userIsAdmin
//         ) {
//             thisOrder = await Order.findOne({
//                 where: {
//                     userId: req.session.userId,
//                     isPurchased: false
//                 }
//             })
//             items = await OrderItem.findAll({ where: { orderId: thisOrder.id } })
//             console.log(products)
//         } else {
//             cart = JSON.parse(localStorage.getItem('cart').products)
//             thisOrder = await Order.create()
//             items = cart.map(elem => {
//                 return {
//                     pricePaid: products.filter(item => item.id === elem.productId)[0]
//                         .currentPrice,
//                     quantity: elem.quantity,
//                     orderId: thisOrder.id,
//                     productId: elem.productId
//                 }
//             })
//             await OrderItem.bulkCreate(items)
//         }
//         const totalCost = items.reduce((acc, cur) => {
//             const curItem = products.filter(item => item.id === cur.productId)
//             acc += cur.quantity * curItem[0].currentPrice
//             return acc
//         }, 0)

//         console.log('cart', cart.products)
//         // const amount = ;

//         let { status } = await stripe.charges.create({
//             amount: totalCost / 100,
//             currency: 'usd',
//             description: `JokeShop Order ${thisOrder.id}`,
//             source: req.body
//         })
//         res.json({ status })
//     } catch (err) {
//         res.status(500)
//         next(err)
//     }
// })
