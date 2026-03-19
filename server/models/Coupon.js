const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code:           { type: DataTypes.STRING(50), unique: true, allowNull: false },
  type:           { type: DataTypes.ENUM('percentage','fixed'), allowNull: false },
  value:          { type: DataTypes.DECIMAL(10,2), allowNull: false },
  minOrderAmount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  maxUses:        { type: DataTypes.INTEGER, allowNull: true }, // null = illimité
  usedCount:      { type: DataTypes.INTEGER, defaultValue: 0 },
  expiresAt:      { type: DataTypes.DATE, allowNull: true },
  isActive:       { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'coupons' });

module.exports = Coupon;