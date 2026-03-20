/**
 * Middleware d'authentification JWT
 * Injecte req.user si le token est valide
 */
const jwt        = require('jsonwebtoken');
const { User }   = require('../models');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Non authentifié. Token manquant.' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Récupère l'utilisateur sans le mot de passe
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive)
      return res.status(401).json({ success: false, message: 'Compte introuvable ou désactivé.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
  }
};

// Middleware optionnel : injecte req.user si token présent, sinon continue
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
  } catch { /* ignoré */ }
  next();
};

module.exports = { protect, optionalAuth };
