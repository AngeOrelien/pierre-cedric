/** Modèle Brand — Marques des produits (Apple, Samsung, HP...) */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Brand = sequelize.define('Brand', {
  id  : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  logo: { type: DataTypes.STRING, allowNull: true },
  website: { type: DataTypes.STRING, allowNull: true },
  isActive: {
    type        : DataTypes.BOOLEAN,
    defaultValue: true,
    field       : 'is_active',
  },
}, { tableName: 'brands' });

module.exports = Brand;
