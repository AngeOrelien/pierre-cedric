const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId:      { type: DataTypes.INTEGER, allowNull: false },
  productId:    { type: DataTypes.INTEGER, allowNull: true },  // peut être null si produit supprimé
  productName:  { type: DataTypes.STRING(300), allowNull: false }, // snapshot
  productSku:   { type: DataTypes.STRING(100), allowNull: true },
  quantity:     { type: DataTypes.INTEGER, allowNull: false },
  unitPrice:    { type: DataTypes.DECIMAL(10,2), allowNull: false },
  totalPrice:   { type: DataTypes.DECIMAL(10,2), allowNull: false },
}, { tableName: 'order_items' });

module.exports = OrderItem;