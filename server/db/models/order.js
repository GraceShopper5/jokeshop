const Sequelize = require('sequelize');
const db = require('../db');

const Order = db.define('order', {
  purchased: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

module.exports = Order;