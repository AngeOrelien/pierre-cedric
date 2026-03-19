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

// ── Associations ──────────────────────────────
User.hasMany(Address,       { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User,     { foreignKey: 'userId' });

User.hasOne(Cart,           { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User,        { foreignKey: 'userId' });

Cart.hasMany(CartItem,      { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart,    { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Category.hasMany(Product,   { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Brand.hasMany(Product,      { foreignKey: 'brandId', as: 'products' });
Product.belongsTo(Brand,    { foreignKey: 'brandId', as: 'brand' });

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Order,         { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User,       { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem,    { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order,  { foreignKey: 'orderId' });
OrderItem.belongsTo(Product,{ foreignKey: 'productId', as: 'product' });

Product.hasMany(Review,     { foreignKey: 'productId', as: 'reviews' });
Review.belongsTo(Product,   { foreignKey: 'productId' });
Review.belongsTo(User,      { foreignKey: 'userId', as: 'user' });

Product.hasMany(StockMovement, { foreignKey: 'productId', as: 'stockMovements' });

// Sous-catégories (auto-référence)
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Category,   { foreignKey: 'parentId', as: 'children' });

// ── Sync automatique des tables ───────────────
// alter: true → modifie les tables existantes sans supprimer les données
const syncDatabase = async () => {
  await sequelize.sync({ 
    // alter: true,  
  });
  console.log('✅ Base de données synchronisée (SQLite)');
};

module.exports = {
    sequelize, 
    syncDatabase,
    User, 
    Address,
    Category,
    Brand,
    Product,
    ProductImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Review,
    Coupon,
    StockMovement,
};