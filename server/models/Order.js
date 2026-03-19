const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.INTEGER, allowNull: false },
  orderNumber: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending','confirmed','processing','shipped','delivered','cancelled','refunded'),
    defaultValue: 'pending'
  },
  subtotal:    { type: DataTypes.DECIMAL(10,2), allowNull: false },
  taxAmount:   { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  shippingFee: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  discountAmount:{ type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  total:       { type: DataTypes.DECIMAL(10,2), allowNull: false },
  couponCode:  { type: DataTypes.STRING(50), allowNull: true },
  notes:       { type: DataTypes.TEXT, allowNull: true },
  // Adresse de livraison (snapshot au moment de la commande)
  shipStreet:  { type: DataTypes.TEXT, allowNull: true },
  shipCity:    { type: DataTypes.STRING(100), allowNull: true },
  shipCountry: { type: DataTypes.STRING(100), allowNull: true },
  paymentMethod: { type: DataTypes.STRING(50), defaultValue: 'cash' },
  paymentStatus: { type: DataTypes.ENUM('pending','paid','failed'), defaultValue: 'pending' },
  paidAt:      { type: DataTypes.DATE, allowNull: true },
  shippedAt:   { type: DataTypes.DATE, allowNull: true },
  deliveredAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'orders' });

module.exports = Order;