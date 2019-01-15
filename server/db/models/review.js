const Sequelize = require('sequelize')
const db = require('../db')

const Review = db.define('Review', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Review
