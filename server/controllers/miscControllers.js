/**
 * CategoryController
 */
const { Category, Product }   = require('../models');
const { generateSlug }        = require('../utils/helpers');

exports.getAll = async (req, res, next) => {
  try {
    const cats = await Category.findAll({
      where  : { isActive: true, parentId: null },
      include: [{ model: Category, as: 'children',
        where: { isActive: true }, required: false }],
      order  : [['sort_order','ASC']],
    });
    res.json({ success: true, data: cats });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;
    const slug     = generateSlug(name) + '-' + Date.now();
    const image    = req.file ? `/uploads/categories/${req.file.filename}` : null;
    const category = await Category.create({ name, slug, image, ...rest });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Catégorie introuvable.' });
    if (req.file) req.body.image = `/uploads/categories/${req.file.filename}`;
    await cat.update(req.body);
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Catégorie introuvable.' });
    await cat.update({ isActive: false });
    res.json({ success: true, message: 'Catégorie désactivée.' });
  } catch (err) { next(err); }
};

// ══════════════════════════════════════════════════════════════════════════
/**
 * BrandController
 */
const { Brand } = require('../models');

exports.brandGetAll = async (req, res, next) => {
  try {
    const brands = await Brand.findAll({ where: { isActive: true }, order: [['name','ASC']] });
    res.json({ success: true, data: brands });
  } catch (err) { next(err); }
};

exports.brandCreate = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug  = generateSlug(name);
    const logo  = req.file ? `/uploads/brands/${req.file.filename}` : null;
    const brand = await Brand.create({ name, slug, logo, ...req.body });
    res.status(201).json({ success: true, data: brand });
  } catch (err) { next(err); }
};

exports.brandUpdate = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: 'Marque introuvable.' });
    if (req.file) req.body.logo = `/uploads/brands/${req.file.filename}`;
    await brand.update(req.body);
    res.json({ success: true, data: brand });
  } catch (err) { next(err); }
};

// ══════════════════════════════════════════════════════════════════════════
/**
 * ReviewController
 */
const { Review, User, Order } = require('../models');

exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, orderId } = req.body;
    const existing = await Review.findOne({ where: { userId: req.user.id, productId } });
    if (existing) return res.status(409).json({ success: false, message: 'Vous avez déjà donné un avis pour ce produit.' });
    const review = await Review.create({ userId: req.user.id, productId, orderId, rating, title, comment });
    res.status(201).json({ success: true, data: review, message: 'Avis soumis, en attente de modération.' });
  } catch (err) { next(err); }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where  : { productId: req.params.id, isApproved: true },
      include: [{ model: User, as: 'user', attributes: ['firstName','lastName','avatar'] }],
      order  : [['created_at','DESC']],
    });
    const avg = reviews.reduce((s,r) => s + r.rating, 0) / (reviews.length || 1);
    res.json({ success: true, data: reviews, averageRating: avg.toFixed(1), total: reviews.length });
  } catch (err) { next(err); }
};

exports.moderateReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Avis introuvable.' });
    await review.update({ isApproved: req.body.isApproved, adminReply: req.body.adminReply });
    res.json({ success: true, data: review });
  } catch (err) { next(err); }
};

// ══════════════════════════════════════════════════════════════════════════
/**
 * UserController — Profil & adresses
 */
const { Address } = require('../models');

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const updates = { firstName, lastName, phone };
    if (req.file) updates.avatar = `/uploads/avatars/${req.file.filename}`;
    await req.user.update(updates);
    res.json({ success: true, data: req.user, message: 'Profil mis à jour.' });
  } catch (err) { next(err); }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id }, order: [['is_default','DESC']] });
    res.json({ success: true, data: addresses });
  } catch (err) { next(err); }
};

exports.addAddress = async (req, res, next) => {
  try {
    // Si nouvelle adresse marquée par défaut → désactiver les autres
    if (req.body.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }
    const address = await Address.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: address });
  } catch (err) { next(err); }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const addr = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!addr) return res.status(404).json({ success: false, message: 'Adresse introuvable.' });
    if (req.body.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    await addr.update(req.body);
    res.json({ success: true, data: addr });
  } catch (err) { next(err); }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const deleted = await Address.destroy({ where: { id: req.params.id, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Adresse introuvable.' });
    res.json({ success: true, message: 'Adresse supprimée.' });
  } catch (err) { next(err); }
};
