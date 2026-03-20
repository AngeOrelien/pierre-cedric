const r = require('express').Router();
const c = require('../controllers/brandController');
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');
r.get('/',       c.getAll);
r.post('/',      protect, isAdmin, c.create);
r.put('/:id',    protect, isAdmin, c.update);
r.delete('/:id', protect, isAdmin, c.delete);
module.exports = r;
