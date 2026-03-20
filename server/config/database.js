/**
 * Configuration Sequelize — Base de données SQLite
 * En production : changer dialect:'sqlite' en dialect:'postgres'
 * et ajouter les credentials PostgreSQL dans .env
 */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect : 'sqlite',
  storage : process.env.DB_PATH || './database.sqlite',

  // Logs SQL en développement uniquement
  logging : process.env.NODE_ENV === 'development'
    ? (sql) => console.log(`\x1b[36m[SQL]\x1b[0m ${sql}`)
    : false,

  define: {
    timestamps : true,    // Ajoute createdAt + updatedAt automatiquement
    underscored: true,    // snake_case pour les colonnes (ex: created_at)
    paranoid   : false,   // Pas de soft-delete par défaut
  },

  // Pool de connexions (utile en production)
  pool: {
    max    : 5,
    min    : 0,
    acquire: 30000,
    idle   : 10000,
  },
});

module.exports = sequelize;
