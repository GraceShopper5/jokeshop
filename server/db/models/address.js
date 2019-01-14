const Sequelize = require('sequelize')
const db = require('../db')

const Address = db.define('address', {
  streetAddress: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false
  },
  zipCode: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Address
