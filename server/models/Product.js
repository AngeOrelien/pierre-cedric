const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:         { type: DataTypes.STRING(300), allowNull: false },
  slug:         { type: DataTypes.STRING(350), unique: true, allowNull: false },
  description:  { type: DataTypes.TEXT, allowNull: true },
  shortDesc:    { type: DataTypes.STRING(500), allowNull: true },
  sku:          { type: DataTypes.STRING(100), unique: true, allowNull: false },
  price:        { type: DataTypes.DECIMAL(10,2), allowNull: false },
  comparePrice: { type: DataTypes.DECIMAL(10,2), allowNull: true }, // prix barré
  costPrice:    { type: DataTypes.DECIMAL(10,2), allowNull: true }, // prix d'achat
  stock:        { type: DataTypes.INTEGER, defaultValue: 0 },
  lowStockAlert:{ type: DataTypes.INTEGER, defaultValue: 5 },       // seuil alerte
  weight:       { type: DataTypes.FLOAT, allowNull: true },         // en grammes
  categoryId:   { type: DataTypes.INTEGER, allowNull: true },
  brandId:      { type: DataTypes.INTEGER, allowNull: true },
  isActive:     { type: DataTypes.BOOLEAN, defaultValue: true },
  isFeatured:   { type: DataTypes.BOOLEAN, defaultValue: false },
  isNew:        { type: DataTypes.BOOLEAN, defaultValue: false },
  tags:         { type: DataTypes.TEXT, allowNull: true },           // JSON stringifié
  specs:        { type: DataTypes.TEXT, allowNull: true },           // JSON specs techniques
  viewCount:    { type: DataTypes.INTEGER, defaultValue: 0 },
  soldCount:    { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'products' });

module.exports = Product;