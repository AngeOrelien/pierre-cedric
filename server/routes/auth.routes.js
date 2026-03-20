const r = require('express').Router();
const c = require('../controllers/authController');
const { protect } = require('../middlewares/auth.middleware');
r.post('/register', c.register);
r.post('/login',    c.login);
r.get('/me',        protect, c.getMe);
r.put('/password',  protect, c.updatePassword);
module.exports = r;
