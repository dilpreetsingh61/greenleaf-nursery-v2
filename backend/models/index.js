const sequelize = require("../db/sequelize");
const Product = require("./Product");
const User = require("./User");
const Contact = require("./Contact");
const NewsletterSubscriber = require("./NewsletterSubscriber");
const Order = require("./Order");
const ServiceBooking = require("./ServiceBooking");
const CartSession = require("./CartSession");
const CartItem = require("./CartItem");

CartSession.hasMany(CartItem, {
  as: "items",
  foreignKey: "cartSessionId",
  onDelete: "CASCADE",
});
CartItem.belongsTo(CartSession, {
  as: "cartSession",
  foreignKey: "cartSessionId",
});
CartItem.belongsTo(Product, {
  as: "product",
  foreignKey: "productId",
});
Product.hasMany(CartItem, {
  as: "cartItems",
  foreignKey: "productId",
});

async function initializeDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
}

module.exports = {
  sequelize,
  initializeDatabase,
  Product,
  User,
  Contact,
  NewsletterSubscriber,
  Order,
  ServiceBooking,
  CartSession,
  CartItem,
};
