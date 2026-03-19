const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cartId:    { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  priceSnapshot: { type: DataTypes.DECIMAL(10,2), allowNull: false }, // prix au moment de l'ajout
}, { tableName: 'cart_items' });

module.exports = CartItem;