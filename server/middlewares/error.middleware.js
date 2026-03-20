/**
 * Middleware d'erreur global — Doit être le DERNIER app.use()
 * Formate toutes les erreurs en JSON uniforme
 */
const errorMiddleware = (err, req, res, next) => {
  let status  = err.status  || err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  // Erreurs Sequelize : contrainte unique
  if (err.name === 'SequelizeUniqueConstraintError') {
    status  = 409;
    message = 'Cette valeur existe déjà.';
  }
  // Erreurs Sequelize : validation
  if (err.name === 'SequelizeValidationError') {
    status  = 422;
    message = err.errors.map(e => e.message).join(', ');
  }
  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    status  = 401;
    message = 'Token invalide.';
  }

  if (process.env.NODE_ENV === 'development') console.error('❌', err.stack);

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
