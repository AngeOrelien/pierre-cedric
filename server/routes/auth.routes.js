const express = require('express');
const router  = express.Router();

// Importer les fonctions du contrôleur
const { register } = require('../controllers/authController');

// Route d'inscription
router.post('/register', register);

module.exports = router;
