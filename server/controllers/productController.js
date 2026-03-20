/**
 * Controller Produits — CRUD + filtres + pagination
 */
const { Op }       = require('sequelize');
const { Product, Category, Brand, ProductImage, Review, User } = require('../models');
const { generateSlug, paginate } = require('../utils/helpers');
const path = require('path');
const fs   = require('fs');

/** GET /api/products */
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page=1, limit=20, categoryId, brandId,
      minPrice, maxPrice, search, sort='createdAt',
      order='DESC', featured, isNew
    } = req.query;

    const where = { isActive: true };
    if (categoryId) where.categoryId = categoryId;
    if (brandId)    where.brandId    = brandId;
    if (featured)   where.isFeatured = true;
    if (isNew)      where.isNew      = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (search) where.name = { [Op.like]: `%${search}%` };

    const { offset, limit: lim } = paginate(page, limit);
    const { rows: products, count } = await Product.findAndCountAll({
      where, offset, limit: lim,
      order: [[sort, order.toUpperCase()]],
      include: [
        { model: Category,     as: 'category', attributes: ['id','name','slug'] },
        { model: Brand,        as: 'brand',    attributes: ['id','name','logo'] },
        { model: ProductImage, as: 'images',   where: { isMain: true }, required: false,
          attributes: ['id','url','altText'] },
      ],
    });
    res.json({ success: true, products, total: count, page: +page, pages: Math.ceil(count/lim) });
  } catch (err) { next(err); }
};

/** GET /api/products/:id */
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { [req.params.id.match(/^\d+$/) ? 'id' : 'slug']: req.params.id, isActive: true },
      include: [
        { model: Category,     as: 'category' },
        { model: Brand,        as: 'brand'    },
        { model: ProductImage, as: 'images', order: [['sortOrder','ASC']] },
        { model: Review,       as: 'reviews', where: { isApproved: true }, required: false,
          include: [{ model: User, as: 'user', attributes: ['id','firstName','lastName','avatar'] }] },
      ],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    await product.increment('viewCount');
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

/** POST /api/products (admin) */
exports.createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body, slug: generateSlug(req.body.name) };
    if (!data.sku) data.sku = `PC-${Date.now()}`;
    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
};

/** PUT /api/products/:id (admin) */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    if (req.body.name && req.body.name !== product.name)
      req.body.slug = generateSlug(req.body.name);
    await product.update(req.body);
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

/** DELETE /api/products/:id (admin) */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    await product.update({ isActive: false }); // soft delete
    res.json({ success: true, message: 'Produit désactivé.' });
  } catch (err) { next(err); }
};

/** POST /api/products/:id/images (admin) */
exports.uploadImages = async (req, res, next) => {
  try {
    if (!req.files?.length)
      return res.status(422).json({ success: false, message: 'Aucun fichier envoyé.' });

    const product    = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable.' });

    const existing   = await ProductImage.count({ where: { productId: product.id } });
    const images     = await ProductImage.bulkCreate(
      req.files.map((f, i) => ({
        productId: product.id,
        url      : `/uploads/${f.filename}`,
        isMain   : existing === 0 && i === 0,
        sortOrder: existing + i,
      }))
    );
    res.status(201).json({ success: true, images });
  } catch (err) { next(err); }
};

/** DELETE /api/products/:productId/images/:imageId (admin) */
exports.deleteImage = async (req, res, next) => {
  try {
    const img = await ProductImage.findByPk(req.params.imageId);
    if (!img) return res.status(404).json({ success: false, message: 'Image introuvable.' });
    const filePath = path.join(__dirname, '..', img.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await img.destroy();
    res.json({ success: true, message: 'Image supprimée.' });
  } catch (err) { next(err); }
};
