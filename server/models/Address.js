const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Address', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:     { type: DataTypes.INTEGER, allowNull: false },
  label:      { type: DataTypes.STRING(50), defaultValue: 'Domicile' },
  street:     { type: DataTypes.TEXT, allowNull: false },
  city:       { type: DataTypes.STRING(100), allowNull: false },
  state:      { type: DataTypes.STRING(100), allowNull: true },
  country:    { type: DataTypes.STRING(100), defaultValue: 'Cameroun' },
  zipCode:    { type: DataTypes.STRING(20), allowNull: true },
  isDefault:  { type: DataTypes.BOOLEAN, defaultValue: false },
  phone:      { type: DataTypes.STRING(20), allowNull: true },
}, { tableName: 'addresses' });

module.exports = Address;