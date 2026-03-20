/**
 * Modèle Order — Commandes clients
 * Statuts : pending → confirmed → processing → shipped → delivered
 *                               └→ cancelled | refunded
 */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  userId     : { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  orderNumber: {
    type     : DataTypes.STRING(50),
    allowNull: false,
    unique   : true,
    field    : 'order_number',
  },

  // ── Statuts ──────────────────────────────────────
  status: {
    type: DataTypes.ENUM(
      'pending','confirmed','processing','shipped','delivered','cancelled','refunded'
    ),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type        : DataTypes.ENUM('pending','paid','failed','refunded'),
    defaultValue: 'pending',
    field       : 'payment_status',
  },
  paymentMethod: {
    type        : DataTypes.STRING(50),
    defaultValue: 'cash_on_delivery',
    field       : 'payment_method',
  },

  // ── Montants ─────────────────────────────────────
  subtotal      : { type: DataTypes.DECIMAL(12,2), allowNull: false },
  taxAmount     : { type: DataTypes.DECIMAL(12,2), defaultValue: 0, field: 'tax_amount' },
  shippingFee   : { type: DataTypes.DECIMAL(12,2), defaultValue: 0, field: 'shipping_fee' },
  discountAmount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0, field: 'discount_amount' },
  total         : { type: DataTypes.DECIMAL(12,2), allowNull: false },

  couponCode: { type: DataTypes.STRING(50), allowNull: true, field: 'coupon_code' },
  notes     : { type: DataTypes.TEXT,       allowNull: true },

  // ── Adresse de livraison (snapshot immuable) ──────
  shipName   : { type: DataTypes.STRING(200), allowNull: true, field: 'ship_name'    },
  shipPhone  : { type: DataTypes.STRING(25),  allowNull: true, field: 'ship_phone'   },
  shipStreet : { type: DataTypes.TEXT,        allowNull: true, field: 'ship_street'  },
  shipCity   : { type: DataTypes.STRING(100), allowNull: true, field: 'ship_city'    },
  shipCountry: { type: DataTypes.STRING(100), allowNull: true, field: 'ship_country' },

  // ── Dates clés ────────────────────────────────────
  paidAt     : { type: DataTypes.DATE, allowNull: true, field: 'paid_at'      },
  shippedAt  : { type: DataTypes.DATE, allowNull: true, field: 'shipped_at'   },
  deliveredAt: { type: DataTypes.DATE, allowNull: true, field: 'delivered_at' },

}, { tableName: 'orders' });

module.exports = Order;
