/** Modèle CartItem — Article dans le panier */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  id       : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cartId   : { type: DataTypes.INTEGER, allowNull: false, field: 'cart_id' },
  productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
  quantity : { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } },
  // Snapshot du prix au moment de l'ajout au panier
  priceSnapshot: { type: DataTypes.DECIMAL(12,2), allowNull: false, field: 'price_snapshot' },
}, { tableName: 'cart_items' });

module.exports = CartItem;
