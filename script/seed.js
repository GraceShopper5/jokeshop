'use strict'

const db = require('../server/db')
const {User, Product, Order, OrderItem, Review} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      firstName: 'cOdy',
      lastName: 'theDog',
      password: '123',
      isAdmin: true
    }),
    User.create({
      email: 'murphy@email.com',
      firstName: 'mUrPhy',
      lastName: 'theCat',
      password: '123'
    })
  ])

  console.log(`seeded ${users.length} users`)

  const products = await Promise.all([
    Product.create({
      name: 'Medieval Jokes',
      currentPrice: 300,
      description: 'Jokes from the middle ages.',
      imageUrl:
        'http://www.historynotes.info/wp-content/uploads/2014/04/medieval-humour-1.jpg'
    }),
    Product.create({
      name: 'Rennaisance Jokes',
      currentPrice: 200,
      description: 'Jokes from the funniest age.',
      imageUrl:
        'http://img1.joyreactor.com/pics/post/renaissance-art-picture-xbox-4277983.jpeg'
    }),
    Product.create({
      name: 'Mom Jokes',
      currentPrice: 240,
      description: 'These jokes will get you kicked out of the house.',
      imageUrl:
        'https://geneticliteracyproject.org/wp-content/uploads/2016/10/01-mother-and-child.jpg'
    }),
    Product.create({
      name: 'Fart Jokes',
      currentPrice: 370,
      description: 'These jokes are silent but deadly.',
      imageUrl:
        'https://riotfest.org/wp-content/uploads/2017/03/fart-spongebob-698x392.jpg'
    })
  ])

  console.log(`seeded ${products.length} products`)

  const orders = await Promise.all([
    // Only one order for each userId can be false
    Order.create({
      userId: 1,
      isPurchased: true
    }),
    Order.create({
      userId: 2,
      isPurchased: true
    })
  ])
  console.log(`seeded ${orders.length} orders`)

  const orderItems = await Promise.all([
    OrderItem.create({
      productId: 1,
      orderId: 3,
      quantity: 2
    }),
    OrderItem.create({
      productId: 2,
      orderId: 3,
      quantity: 1
    }),
    OrderItem.create({
      productId: 3,
      orderId: 4,
      quantity: 1
    })
  ])
  console.log(`seeded ${orderItems.length} order items`)

  const reviews = await Promise.all([
    Review.create({
      productId: 1,
      userId: 1,
      content: 'I like it'
    }),
    Review.create({
      productId: 1,
      userId: 2,
      content: 'I hate it'
    }),
    Review.create({
      productId: 3,
      userId: 1,
      content: 'I meh it'
    })
  ])
  console.log(`seeded ${reviews.length} reviews`)

  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
