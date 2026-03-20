/** Modèle Cart — Panier d'un utilisateur (1 par user) */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Cart = sequelize.define('Cart', {
  id    : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'user_id' },
}, { tableName: 'carts' });

module.exports = Cart;
