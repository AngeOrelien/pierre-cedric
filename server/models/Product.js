/**
 * Modèle Product — Cœur du système e-commerce
 * Gère : prix, stock, SEO (slug), specs techniques, images
 */
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: {
    type     : DataTypes.STRING(300),
    allowNull: false,
  },
  slug: {
    type     : DataTypes.STRING(350),
    allowNull: false,
    unique   : true,
  },
  description: {
    type     : DataTypes.TEXT,
    allowNull: true,
  },
  shortDesc: {
    // Résumé affiché dans les cards produit
    type     : DataTypes.STRING(500),
    allowNull: true,
    field    : 'short_desc',
  },
  sku: {
    // Stock Keeping Unit : code unique interne
    type     : DataTypes.STRING(100),
    allowNull: false,
    unique   : true,
  },

  // ── Prix ──────────────────────────────────────────
  price: {
    type     : DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate : { min: 0 },
  },
  comparePrice: {
    // Prix barré (avant promotion)
    type     : DataTypes.DECIMAL(12, 2),
    allowNull: true,
    field    : 'compare_price',
  },
  costPrice: {
    // Prix d'achat (marge interne)
    type     : DataTypes.DECIMAL(12, 2),
    allowNull: true,
    field    : 'cost_price',
  },

  // ── Stock ─────────────────────────────────────────
  stock: {
    type        : DataTypes.INTEGER,
    defaultValue: 0,
    validate    : { min: 0 },
  },
  lowStockAlert: {
    // Seuil d'alerte stock faible
    type        : DataTypes.INTEGER,
    defaultValue: 5,
    field       : 'low_stock_alert',
  },

  // ── Caractéristiques ──────────────────────────────
  weight: {
    type     : DataTypes.FLOAT,
    allowNull: true, // en grammes
  },
  specs: {
    // Objet JSON des specs techniques : { RAM, CPU, Écran... }
    type     : DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('specs');
      return raw ? JSON.parse(raw) : null;
    },
    set(val) {
      this.setDataValue('specs', val ? JSON.stringify(val) : null);
    },
  },
  tags: {
    // Tableau JSON de tags : ["refurbished","promo"]
    type     : DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('tags');
      return raw ? JSON.parse(raw) : [];
    },
    set(val) {
      this.setDataValue('tags', val ? JSON.stringify(val) : null);
    },
  },

  // ── Relations ─────────────────────────────────────
  categoryId: {
    type     : DataTypes.INTEGER,
    allowNull: true,
    field    : 'category_id',
  },
  brandId: {
    type     : DataTypes.INTEGER,
    allowNull: true,
    field    : 'brand_id',
  },

  // ── Flags ─────────────────────────────────────────
  isActive  : { type: DataTypes.BOOLEAN, defaultValue: true,  field: 'is_active'   },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_featured' },
  isNew     : { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_new'      },

  // ── Statistiques ──────────────────────────────────
  viewCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'view_count' },
  soldCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sold_count' },

}, { tableName: 'products' });

module.exports = Product;
