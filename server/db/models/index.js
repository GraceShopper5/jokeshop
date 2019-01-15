const User = require('./user')
const Product = require('./product')
const Order = require('./order')
const OrderItem = require('./orderItem')
const Address = require('./address')
const Review = require('./review')

Order.belongsTo(User)
User.hasMany(Order)

Order.belongsToMany(Product, {through: 'OrderItem'})
Product.belongsToMany(Order, {through: 'OrderItem'})

User.belongsToMany(Product, {through: 'Review'})
Product.belongsToMany(User, {through: 'Review'})

User.hasMany(Address)
Address.belongsTo(User)

Order.belongsTo(Address)
Address.hasMany(Order)

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  Review,
  Address
}
