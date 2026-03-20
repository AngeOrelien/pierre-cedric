/**
 * Controller Auth — register, login, getMe, updatePassword
 */
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const { User, Cart } = require('../models');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/** POST /api/auth/register */
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(422).json({ success: false, message: 'Tous les champs obligatoires doivent être remplis.' });

    if (await User.findOne({ where: { email } }))
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ firstName, lastName, email, password: hashed, phone });
    // Créer automatiquement le panier vide
    await Cart.create({ userId: user.id });

    const token = signToken(user.id, user.role);
    const { password: _, ...userSafe } = user.toJSON();
    res.status(201).json({ success: true, token, user: userSafe });
  } catch (err) { next(err); }
};

/** POST /api/auth/login */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(422).json({ success: false, message: 'Email et mot de passe requis.' });

    // scope 'withPassword' inclut le champ password
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Compte désactivé. Contactez le support.' });

    await user.update({ lastLoginAt: new Date() });
    const token = signToken(user.id, user.role);
    const { password: _, ...userSafe } = user.toJSON();
    res.json({ success: true, token, user: userSafe });
  } catch (err) { next(err); }
};

/** GET /api/auth/me */
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

/** PUT /api/auth/password */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.scope('withPassword').findByPk(req.user.id);
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    await user.update({ password: await bcrypt.hash(newPassword, 12) });
    res.json({ success: true, message: 'Mot de passe mis à jour.' });
  } catch (err) { next(err); }
};
