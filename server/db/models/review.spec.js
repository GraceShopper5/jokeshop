const db = require('../db')
const Review = require('./review')

const chai = require('chai')
const expect = chai.expect

describe('Reviews Model Test', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
})

describe('Validations', () => {
  it('it has content', async () => {
    try {
      const review = await Review.build()
      await review.validate()
      throw Error(
        'Validation was successful but should have failed without content'
      )
    } catch (error) {
      expect(error.message).to.contain('content cannot be null')
    }
  })
  it('requires content to not be an empty string', async () => {
    const review = Review.build({content: ''})
    try {
      await review.validate()
      throw Error(
        'Validation was successful but should have failed if content is an empty string'
      )
    } catch (error) {
      expect(error.message).to.contain('notEmpty')
    }
  })
})
