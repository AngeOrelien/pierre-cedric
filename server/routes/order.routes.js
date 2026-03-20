const r = require('express').Router();
const c = require('../controllers/orderController');
const { protect } = require('../middlewares/auth.middleware');
r.post('/',          protect, c.createOrder);
r.get('/',           protect, c.getMyOrders);
r.get('/:id',        protect, c.getOrder);
r.put('/:id/cancel', protect, c.cancelOrder);
module.exports = r;
