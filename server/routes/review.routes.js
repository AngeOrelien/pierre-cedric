const r = require('express').Router();
const c = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth.middleware');
r.post('/', protect, c.createReview);
module.exports = r;
