/** Modèle ProductImage — Images d'un produit (galerie) */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
  id       : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
  url      : { type: DataTypes.STRING,  allowNull: false },
  altText  : { type: DataTypes.STRING(200), allowNull: true, field: 'alt_text' },
  isMain   : { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_main' },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0,     field: 'sort_order' },
}, { tableName: 'product_images' });

module.exports = ProductImage;
