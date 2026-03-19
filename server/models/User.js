const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstName: {type: DataTypes.STRING(100), allowNull: false},
    lastName: {type: DataTypes.STRING(100), allowNull: false},
    email: {type: DataTypes.STRING(200), allowNull: false, unique: true, validate: {isEmail: true}},
    password: {type: DataTypes.STRING(255), allowNull: false},
    phone: {type: DataTypes.STRING(20), allowNull: true},
    role: {type: DataTypes.ENUM('customer', 'admin'), allowNull:false, defaultValue: 'customer'},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
    lastLogin: {type: DataTypes.DATE, allowNull: true},
}, {tableName: 'users'});

module.exports = User;