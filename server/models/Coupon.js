/** Modèle Coupon — Codes promotionnels */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id  : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  type: { type: DataTypes.ENUM('percentage','fixed'), allowNull: false }, // % ou montant fixe
  value          : { type: DataTypes.DECIMAL(10,2), allowNull: false },
  minOrderAmount : { type: DataTypes.DECIMAL(10,2), defaultValue: 0, field: 'min_order_amount' },
  maxUses        : { type: DataTypes.INTEGER, allowNull: true, field: 'max_uses' }, // null = illimité
  usedCount      : { type: DataTypes.INTEGER, defaultValue: 0, field: 'used_count' },
  expiresAt      : { type: DataTypes.DATE,    allowNull: true, field: 'expires_at' },
  isActive       : { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
}, { tableName: 'coupons' });

module.exports = Coupon;
