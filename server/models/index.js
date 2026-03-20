/**
 * models/index.js — Associations Sequelize + Sync automatique
 */
const sequelize     = require('../config/database');
const User          = require('./User');
const Address       = require('./Address');
const Category      = require('./Category');
const Brand         = require('./Brand');
const Product       = require('./Product');
const ProductImage  = require('./ProductImage');
const Cart          = require('./Cart');
const CartItem      = require('./CartItem');
const Order         = require('./Order');
const OrderItem     = require('./OrderItem');
const Review        = require('./Review');
const Coupon        = require('./Coupon');
const StockMovement = require('./StockMovement');

// ── User ↔ Address
User.hasMany(Address,    { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User,  { foreignKey: 'userId' });
// ── User ↔ Cart (1:1)
User.hasOne(Cart,        { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User,     { foreignKey: 'userId' });
// ── Cart ↔ CartItem
Cart.hasMany(CartItem,       { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart,     { foreignKey: 'cartId' });
CartItem.belongsTo(Product,  { foreignKey: 'productId', as: 'product' });
Product.hasMany(CartItem,    { foreignKey: 'productId' });
// ── Category auto-référence
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent'   });
Category.hasMany(Category,   { foreignKey: 'parentId', as: 'children' });
// ── Product ↔ Category & Brand
Category.hasMany(Product,   { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Brand.hasMany(Product,      { foreignKey: 'brandId',    as: 'products' });
Product.belongsTo(Brand,    { foreignKey: 'brandId',    as: 'brand'    });
// ── Product ↔ Images
Product.hasMany(ProductImage,   { foreignKey: 'productId', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });
// ── User ↔ Order
User.hasMany(Order,   { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user'   });
// ── Order ↔ OrderItem
Order.hasMany(OrderItem,     { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order,   { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem,   { foreignKey: 'productId' });
// ── Product ↔ Review
Product.hasMany(Review,   { foreignKey: 'productId', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'productId' });
Review.belongsTo(User,    { foreignKey: 'userId', as: 'user' });
User.hasMany(Review,      { foreignKey: 'userId', as: 'reviews' });
// ── Product ↔ StockMovement
Product.hasMany(StockMovement,   { foreignKey: 'productId', as: 'stockMovements' });
StockMovement.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
StockMovement.belongsTo(User,    { foreignKey: 'userId',    as: 'author'  });

const syncDatabase = async () => {
  // const isTest = process.env.NODE_ENV === 'test';

  await sequelize.sync({ 
    alter: false, // alter: true = tente de faire les modifications nécessaires sans perdre de données (pratique en prod)
    force: false // true = supprime et recrée les tables à chaque lancement (pratique en dev, à éviter en prod)
  });
  console.log('✅ Base de données synchronisée (SQLite)');
};

module.exports = {
  sequelize, syncDatabase,
  User, Address, Category, Brand, Product, ProductImage,
  Cart, CartItem, Order, OrderItem, Review, Coupon, StockMovement,
};
