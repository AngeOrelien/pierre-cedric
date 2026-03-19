const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:        { type: DataTypes.STRING(150), allowNull: false },
  slug:        { type: DataTypes.STRING(200), unique: true, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  image:       { type: DataTypes.STRING, allowNull: true },
  parentId:    { type: DataTypes.INTEGER, allowNull: true, references: { model: 'categories', key: 'id' } },
  sortOrder:   { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive:    { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'categories' });

module.exports = Category;