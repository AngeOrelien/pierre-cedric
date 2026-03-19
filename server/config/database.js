const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './database.js',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true, // createdAt + updatedAt auto
        underscored: true, // snake_case pour les colonnes
        paranoid: false, // pas de soft delete par défaut
    },
});

module.exports = sequelize;