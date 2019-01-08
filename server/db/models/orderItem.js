const Sequelize = require('sequelize')
const db = require('../db')

const OrderItem = db.define('orderItem', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  pricePaid: {
    type: Sequelize.INTEGER
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
})

module.exports = OrderItem
