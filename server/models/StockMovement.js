/** Modèle StockMovement — Historique des mouvements de stock */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id       : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
  userId   : { type: DataTypes.INTEGER, allowNull: true,  field: 'user_id'   },
  type: {
    type: DataTypes.ENUM('in','out','adjustment','sale','return','damage'),
    allowNull: false,
  },
  quantity    : { type: DataTypes.INTEGER,     allowNull: false },
  reason      : { type: DataTypes.STRING(300), allowNull: true  },
  reference   : { type: DataTypes.STRING(100), allowNull: true  },
  stockBefore : { type: DataTypes.INTEGER,     allowNull: false, field: 'stock_before' },
  stockAfter  : { type: DataTypes.INTEGER,     allowNull: false, field: 'stock_after'  },
}, { tableName: 'stock_movements' });

module.exports = StockMovement;
