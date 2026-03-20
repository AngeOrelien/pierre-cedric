/** Controller Catégories */
const { Category, Product } = require('../models');
const { generateSlug } = require('../utils/helpers');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where  : { isActive: true, parentId: null },
      order  : [['sortOrder','ASC']],
      include: [{ model: Category, as: 'children', where:{ isActive:true }, required:false }],
    });
    res.json({ success: true, categories });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const cat = await Category.create({ ...req.body, slug: generateSlug(req.body.name) });
    res.status(201).json({ success: true, category: cat });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Catégorie introuvable.' });
    if (req.body.name) req.body.slug = generateSlug(req.body.name);
    await cat.update(req.body);
    res.json({ success: true, category: cat });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await Category.update({ isActive: false }, { where: { id: req.params.id } });
    res.json({ success: true, message: 'Catégorie désactivée.' });
  } catch (err) { next(err); }
};
