/** Modèle Review — Avis clients sur les produits */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Review = sequelize.define('Review', {
  id       : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId   : { type: DataTypes.INTEGER, allowNull: false, field: 'user_id'   },
  productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id'},
  orderId  : { type: DataTypes.INTEGER, allowNull: true,  field: 'order_id'  }, // vérifie achat réel
  rating   : { type: DataTypes.INTEGER, allowNull: false, validate: { min:1, max:5 } },
  title    : { type: DataTypes.STRING(200), allowNull: true  },
  comment  : { type: DataTypes.TEXT,        allowNull: true  },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_approved' },
  adminReply: { type: DataTypes.TEXT, allowNull: true, field: 'admin_reply' },
}, { tableName: 'reviews' });

module.exports = Review;
