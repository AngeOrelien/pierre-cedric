/** Modèle Category — Catégories et sous-catégories de produits */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: {
    type     : DataTypes.STRING(150),
    allowNull: false,
    validate : { notEmpty: true },
  },
  slug: {
    // URL-friendly : ex "smartphones-android"
    type     : DataTypes.STRING(200),
    allowNull: false,
    unique   : true,
  },
  description: {
    type     : DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type     : DataTypes.STRING,
    allowNull: true,
  },
  icon: {
    // Nom d'icône Heroicons : ex "device-phone-mobile"
    type     : DataTypes.STRING(100),
    allowNull: true,
  },
  parentId: {
    // Null = catégorie racine | Integer = sous-catégorie
    type      : DataTypes.INTEGER,
    allowNull : true,
    field     : 'parent_id',
    references: { model: 'categories', key: 'id' },
  },
  sortOrder: {
    type        : DataTypes.INTEGER,
    defaultValue: 0,
    field       : 'sort_order',
  },
  isActive: {
    type        : DataTypes.BOOLEAN,
    defaultValue: true,
    field       : 'is_active',
  },
}, { tableName: 'categories' });

module.exports = Category;
