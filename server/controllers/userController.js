/** Controller User — profil, adresses */
const { User, Address, Order } = require('../models');

/** PUT /api/users/profile */
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    let avatar = req.user.avatar;
    if (req.file) avatar = `/uploads/${req.file.filename}`;
    await req.user.update({ firstName, lastName, phone, avatar });
    res.json({ success: true, user: req.user });
  } catch (err) { next(err); }
};

/** GET /api/users/addresses */
exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id }, order:[['isDefault','DESC']] });
    res.json({ success: true, addresses });
  } catch (err) { next(err); }
};

/** POST /api/users/addresses */
exports.createAddress = async (req, res, next) => {
  try {
    if (req.body.isDefault)
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    const address = await Address.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, address });
  } catch (err) { next(err); }
};

/** PUT /api/users/addresses/:id */
exports.updateAddress = async (req, res, next) => {
  try {
    const addr = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!addr) return res.status(404).json({ success: false, message: 'Adresse introuvable.' });
    if (req.body.isDefault)
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    await addr.update(req.body);
    res.json({ success: true, address: addr });
  } catch (err) { next(err); }
};

/** DELETE /api/users/addresses/:id */
exports.deleteAddress = async (req, res, next) => {
  try {
    await Address.destroy({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ success: true, message: 'Adresse supprimée.' });
  } catch (err) { next(err); }
};
