const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:     { type: DataTypes.INTEGER, allowNull: false },
  productId:  { type: DataTypes.INTEGER, allowNull: false },
  orderId:    { type: DataTypes.INTEGER, allowNull: true },  // pour vérifier l'achat
  rating:     { type: DataTypes.INTEGER, allowNull: false, validate: { min:1, max:5 } },
  title:      { type: DataTypes.STRING(200), allowNull: true },
  comment:    { type: DataTypes.TEXT, allowNull: true },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'reviews' });

module.exports = Review;