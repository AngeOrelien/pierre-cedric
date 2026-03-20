/** Modèle OrderItem — Ligne de commande (snapshot produit) */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id        : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId   : { type: DataTypes.INTEGER, allowNull: false, field: 'order_id' },
  productId : { type: DataTypes.INTEGER, allowNull: true,  field: 'product_id'  }, // null si produit supprimé
  // Snapshots immuables au moment de la commande
  productName: { type: DataTypes.STRING(300), allowNull: false, field: 'product_name' },
  productSku : { type: DataTypes.STRING(100), allowNull: true,  field: 'product_sku'  },
  quantity   : { type: DataTypes.INTEGER,     allowNull: false  },
  unitPrice  : { type: DataTypes.DECIMAL(12,2), allowNull: false, field: 'unit_price'  },
  totalPrice : { type: DataTypes.DECIMAL(12,2), allowNull: false, field: 'total_price' },
}, { tableName: 'order_items' });

module.exports = OrderItem;
