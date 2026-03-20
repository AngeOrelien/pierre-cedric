/** Controller Avis */
const { Review, Product, Order, OrderItem } = require('../models');

/** POST /api/reviews */
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, orderId } = req.body;
    // Vérifier qu'il a commandé ce produit
    if (orderId) {
      const item = await OrderItem.findOne({ where: { orderId, productId } });
      if (!item) return res.status(403).json({ success:false, message:'Achat non vérifié.' });
    }
    const existing = await Review.findOne({ where: { userId: req.user.id, productId } });
    if (existing) return res.status(409).json({ success:false, message:'Vous avez déjà laissé un avis.' });

    const review = await Review.create({ userId: req.user.id, productId, orderId, rating, title, comment });
    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
};

/** GET /api/products/:id/reviews */
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where  : { productId: req.params.id, isApproved: true },
      order  : [['createdAt','DESC']],
      include: [{ association:'user', attributes:['id','firstName','lastName','avatar'] }],
    });
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};
