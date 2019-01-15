const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
const Order = require('./order')
const Product = require('./product')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

User.getUserShoppingCart = async function(userId) {
  const shoppingCart = await Order.findOne({
    where: {userId, isPurchased: false},
    include: [{model: Product}]
  })
  return shoppingCart
}

User.prototype.getShoppingCart = async function() {
  const shoppingCart = await Order.findOne({
    where: {userId: this.id, isPurchased: false},
    include: [{model: Product}]
  })
  return shoppingCart
}

User.prototype.getOrderHistory = async function() {
  const orderHistory = await Order.findAll({
    where: {userId: this.id, isPurchased: true},
    include: [{model: Product}],
    order: [['purchaseDate', 'DESC']]
  })
  return orderHistory
}

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

const nameCase = user => {
  const {firstName, lastName} = user
  user.firstName = firstName[0].toUpperCase() + firstName.slice(1).toLowerCase()
  user.lastName = lastName[0].toUpperCase() + lastName.slice(1).toLowerCase()
}

const createShoppingCart = async user => {
  const newOrder = await Order.createUserOrder(user.id, false)
  console.log(
    `created new order for new user ${user.firstName} (${user.id}) order #${
      newOrder.id
    }`
  )
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeCreate(nameCase)
User.afterCreate(createShoppingCart)
