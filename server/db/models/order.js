const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  isPurchased: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  purchaseDate: {
    type: Sequelize.DATE
  }
})

Order.createUserOrder = function(userId, isPurchased) {
  return this.create({userId, isPurchased})
}

module.exports = Order
