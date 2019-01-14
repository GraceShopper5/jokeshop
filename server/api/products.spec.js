const {expect} = require('chai')
const db = require('../index')
const Product = db.model('product')
const app = require('../index')
const agent = require('supertest')(app)

describe('Products Test', () => {
  let storedProducts

  const productData = [
    {
      name: 'Silly Billy',
      currentPrice: 200,
      description: 'Billy Goat'
    },
    {
      name: 'Silly Jilly',
      currentPrice: 200,
      description: 'Jilly Goat'
    },
    {
      name: 'Silly Lilly',
      currentPrice: 200,
      description: 'Lilly Goat'
    },
    {
      name: 'Silly Gilly',
      currentPrice: 200,
      description: 'Gilly Goat'
    }
  ]

  beforeEach(async () => {
    const createdProducts = await Product.bulkCreate(productData)
    storedProducts = createdProducts.map(product => product.dataValues)
  })
})
