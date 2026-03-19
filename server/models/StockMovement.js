const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  userId:    { type: DataTypes.INTEGER, allowNull: true },  // admin qui a fait le mouvement
  type:      { type: DataTypes.ENUM('in','out','adjustment','sale','return'), allowNull: false },
  quantity:  { type: DataTypes.INTEGER, allowNull: false }, // positif ou négatif
  reason:    { type: DataTypes.STRING(300), allowNull: true },
  reference: { type: DataTypes.STRING(100), allowNull: true }, // ex: numéro de commande
  stockBefore:{ type: DataTypes.INTEGER, allowNull: false },
  stockAfter: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'stock_movements' });

module.exports = StockMovement;