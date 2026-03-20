/**
 * Modèle User — Utilisateurs de la plateforme
 * Rôles : customer (client) | admin (administrateur)
 */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type         : DataTypes.INTEGER,
    primaryKey   : true,
    autoIncrement: true,
  },
  firstName: {
    type     : DataTypes.STRING(100),
    allowNull: false,
    validate : { notEmpty: true },
    field    : 'first_name',
  },
  lastName: {
    type     : DataTypes.STRING(100),
    allowNull: false,
    validate : { notEmpty: true },
    field    : 'last_name',
  },
  email: {
    type     : DataTypes.STRING(200),
    allowNull: false,
    unique   : true,
    validate : { isEmail: true },
  },
  password: {
    type     : DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type     : DataTypes.STRING(25),
    allowNull: true,
  },
  avatar: {
    type     : DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type        : DataTypes.ENUM('customer', 'admin'),
    defaultValue: 'customer',
  },
  isActive: {
    type        : DataTypes.BOOLEAN,
    defaultValue: true,
    field       : 'is_active',
  },
  lastLoginAt: {
    type     : DataTypes.DATE,
    allowNull: true,
    field    : 'last_login_at',
  },
}, {
  tableName: 'users',
  // Hook : ne jamais retourner le mot de passe dans les réponses JSON
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: { attributes: {} }, // Inclut le mot de passe (pour login)
  },
});

module.exports = User;
