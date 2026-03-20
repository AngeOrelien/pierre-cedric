/** Controller Marques */
const { Brand }  = require('../models');
const { generateSlug } = require('../utils/helpers');

exports.getAll   = async (req, res, next) => {
  try {
    const brands = await Brand.findAll({ where: { isActive: true }, order:[['name','ASC']] });
    res.json({ success: true, brands });
  } catch (err) { next(err); }
};
exports.create   = async (req, res, next) => {
  try {
    const brand = await Brand.create({ ...req.body, slug: generateSlug(req.body.name) });
    res.status(201).json({ success: true, brand });
  } catch (err) { next(err); }
};
exports.update   = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ success:false, message:'Marque introuvable.' });
    if (req.body.name) req.body.slug = generateSlug(req.body.name);
    await brand.update(req.body);
    res.json({ success: true, brand });
  } catch (err) { next(err); }
};
exports.delete   = async (req, res, next) => {
  try {
    await Brand.update({ isActive: false }, { where: { id: req.params.id } });
    res.json({ success: true, message: 'Marque désactivée.' });
  } catch (err) { next(err); }
};
