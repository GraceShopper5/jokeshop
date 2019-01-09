'use strict'

const db = require('../server/db')
const {User, Product, Order, OrderItem} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      firstName: 'cOdy',
      lastName: 'theDog',
      password: '123'
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
      name: 'Medieval Joke',
      currentPrice: 300,
      description: 'A joke from the middle ages.'
    }),
    Product.create({
      name: 'Rennaisance Joke',
      currentPrice: 200,
      description: 'A joke from the funniest age.'
    }),
    Product.create({
      name: 'Post-modern Joke',
      currentPrice: 200,
      description: 'A joke from the least sensical age.'
    })
  ])

  console.log(`seeded ${products.length} products`)

  const orders = await Promise.all([
    Order.create({
      userId: 1
    }),
    Order.create({
      userId: 1
    }),
    Order.create({
      userId: 2
    })
  ])
  console.log(`seeded ${orders.length} orders`)

  const orderItems = await Promise.all([
    OrderItem.create({
      productId: 1,
      orderId: 1,
      quantity: 2
    }),
    OrderItem.create({
      productId: 2,
      orderId: 1,
      quantity: 1
    }),
    OrderItem.create({
      productId: 3,
      orderId: 2,
      quantity: 1
    })
  ])
  console.log(`seeded ${orderItems.length} order items`)

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
