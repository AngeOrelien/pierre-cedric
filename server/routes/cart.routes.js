const r = require('express').Router();
const c = require('../controllers/cartController');
const { protect } = require('../middlewares/auth.middleware');
r.get('/',            protect, c.getCart);
r.post('/items',      protect, c.addItem);
r.put('/items/:id',   protect, c.updateItem);
r.delete('/items/:id',protect, c.removeItem);
r.delete('/',         protect, c.clearCart);
module.exports = r;
