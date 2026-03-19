const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Erreur interne du serveur';
    // Log de l'erreur pour le développement
    if (process.env.NODE_ENV === 'development') console.error(err.stack);
    
    res.status(status).json({ success: false, message });
};

module.exports = errorMiddleware;