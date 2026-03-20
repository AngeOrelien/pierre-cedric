/**
 * Configuration Express — Middlewares globaux + Routes
 */
const express        = require('express');
const cors           = require('cors');
const path           = require('path');
const routes         = require('../routes');
const errorMiddleware = require('../middlewares/error.middleware');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin     : process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods    : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsers ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Fichiers statiques (images uploadées) ────────────────────────────────
app.use('/uploads', express.static(
  path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')
));

// ─── Routes API ───────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── Route de santé (health check) ───────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status : 'ok',
    app    : 'Pierre-Cédric API',
    version: '1.0.0',
    time   : new Date().toISOString(),
  });
});

// ─── Middleware d'erreur global (TOUJOURS en dernier) ─────────────────────
app.use(errorMiddleware);

module.exports = app;
