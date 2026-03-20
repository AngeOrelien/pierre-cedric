/** Middleware de restriction admin — à utiliser APRÈS protect */
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs.' });
  next();
};
module.exports = { isAdmin };
