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
      name: 'Programming Jokes',
      currentPrice: 1010,
      description: 'if (joke.isFunny()) return people.laugh() ',
      imageUrl:
        'https://dtqnv8in03d1n.cloudfront.net/wp-content/uploads/2016/09/best-programming-habits-to-have.jpg'
    }),
    Product.create({
      name: 'Family Jokes',
      currentPrice: 240,
      description:
        "These jokes might have you sleeping on the sofa for the night, but you've got to have something up your sleeve for when your uncle starts talking about politics at Thanksgiving.",
      imageUrl:
        'https://geneticliteracyproject.org/wp-content/uploads/2016/10/01-mother-and-child.jpg'
    }),
    Product.create({
      name: 'Fart Jokes',
      currentPrice: 370,
      description: 'These jokes are silent but deadly.',
      imageUrl:
        'https://riotfest.org/wp-content/uploads/2017/03/fart-spongebob-698x392.jpg'
    }),
    Product.create({
      name: 'Political Jokes',
      currentPrice: 560,
      description:
        'These jokes were funny before 2016, but now they just feel too real.',
      imageUrl:
        'https://cdn.japantimes.2xx.jp/wp-content/uploads/2019/01/f-burgers-a-20190116-870x613.jpg'
    }),
    Product.create({
      name: 'Dystopian Jokes',
      currentPrice: 1984,
      description: 'These jokes will make you believe that 1+1=3.',
      imageUrl:
        'https://res.cloudinary.com/jerrick/image/upload/f_auto,fl_progressive,q_auto,c_fit,w_1100/s3aljndfm6daki1ck1sq'
    }),
    Product.create({
      name: 'Medieval Jokes',
      currentPrice: 300,
      description: "These jokes didn't age well.",
      imageUrl:
        'http://www.historynotes.info/wp-content/uploads/2014/04/medieval-humour-1.jpg'
    }),
    Product.create({
      name: 'Love Jokes',
      currentPrice: 214,
      description: 'These jokes will break your heart.',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLdfJVpKjQ_ym61SIRu89plexGCRnlCDQ2uY5N2RlXLPu0oH9d'
    }),
    Product.create({
      name: 'Road-Crossing Jokes',
      currentPrice: 59,
      description: 'These jokes are about the journey, not the destination.',
      imageUrl: 'https://i.ytimg.com/vi/_6nSOgsI_vo/hqdefault.jpg'
    })
  ])

  console.log(`seeded ${products.length} products`)

  const orders = await Promise.all([
    // Only one order for each userId can be false
    Order.create({
      userId: 1,
      isPurchased: true,
      purchaseDate: '2019-01-15 11:41:26'
    }),
    Order.create({
      userId: 2,
      isPurchased: true,
      purchaseDate: '2019-01-12 11:41:26'
    })
  ])
  console.log(`seeded ${orders.length} orders`)

  const orderItems = await Promise.all([
    OrderItem.create({
      productId: 1,
      orderId: 3,
      quantity: 2,
      pricePaid: 1089
    }),
    OrderItem.create({
      productId: 2,
      orderId: 3,
      quantity: 1,
      pricePaid: 1231
    }),
    OrderItem.create({
      productId: 3,
      orderId: 4,
      quantity: 12,
      pricePaid: 1283
    }),
    OrderItem.create({
      productId: 7,
      orderId: 4,
      quantity: 12,
      pricePaid: 104
    })
  ])
  console.log(`seeded ${orderItems.length} order items`)

  const reviews = await Promise.all([
    Review.create({
      productId: 2,
      userId: 1,
      content: 'These jokes ended my marriage. Thanks Jokeshop!'
    }),
    Review.create({
      productId: 3,
      userId: 2,
      content: "These jokes are a blast! You'll have trouble holding them in!"
    }),
    Review.create({
      productId: 7,
      userId: 2,
      content:
        'These seemed less like jokes and more like personal attacks on my love life (or lack thereof).'
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
