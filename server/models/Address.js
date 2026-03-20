/** Modèle Address — Adresses de livraison des clients */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Address = sequelize.define('Address', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  userId: {
    type     : DataTypes.INTEGER,
    allowNull: false,
    field    : 'user_id',
  },
  label: {
    // Ex : "Domicile", "Bureau", "Autre"
    type        : DataTypes.STRING(80),
    defaultValue: 'Domicile',
  },
  recipientName: {
    type     : DataTypes.STRING(200),
    allowNull: true,
    field    : 'recipient_name',
  },
  street: {
    type     : DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type     : DataTypes.STRING(100),
    allowNull: false,
  },
  state: {
    type     : DataTypes.STRING(100),
    allowNull: true,
  },
  country: {
    type        : DataTypes.STRING(100),
    defaultValue: 'Cameroun',
  },
  zipCode: {
    type     : DataTypes.STRING(20),
    allowNull: true,
    field    : 'zip_code',
  },
  phone: {
    type     : DataTypes.STRING(25),
    allowNull: true,
  },
  isDefault: {
    type        : DataTypes.BOOLEAN,
    defaultValue: false,
    field       : 'is_default',
  },
}, { tableName: 'addresses' });

module.exports = Address;
