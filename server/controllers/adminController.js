/**
 * Controller Admin — Dashboard + gestion stock + clients + commandes
 */
const { Op, fn, col, literal } = require('sequelize');
const {
  User, Product, Order, OrderItem, Review,
  StockMovement, Category, Brand
} = require('../models');

/** GET /api/admin/stats — KPIs tableau de bord */
exports.getStats = async (req, res, next) => {
  try {
    const today    = new Date(); today.setHours(0,0,0,0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalCustomers, totalProducts, totalOrders,
      pendingOrders, revenue, lowStockProducts,
      recentOrders, topProducts
    ] = await Promise.all([
      User.count({ where: { role: 'customer' } }),
      Product.count({ where: { isActive: true } }),
      Order.count(),
      Order.count({ where: { status: 'pending' } }),
      Order.sum('total', { where: { status: { [Op.notIn]:['cancelled','refunded'] } } }),
      Product.count({ where: { isActive:true, stock: { [Op.lte]: literal('low_stock_alert') } } }),
      Order.findAll({
        limit: 10, order: [['createdAt','DESC']],
        include: [{ model: User, as:'user', attributes:['id','firstName','lastName','email'] }],
      }),
      Product.findAll({
        where: { isActive:true }, order:[['soldCount','DESC']], limit:5,
        attributes:['id','name','price','stock','soldCount'],
        include:[{ association:'images', where:{isMain:true}, required:false, attributes:['url'] }],
      }),
    ]);

    res.json({
      success: true,
      stats: { totalCustomers, totalProducts, totalOrders, pendingOrders,
               revenue: revenue || 0, lowStockProducts },
      recentOrders,
      topProducts,
    });
  } catch (err) { next(err); }
};

/** GET /api/admin/orders — Toutes les commandes avec filtres */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page=1, limit=20, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.orderNumber = { [Op.like]: `%${search}%` };

    const { rows: orders, count } = await Order.findAndCountAll({
      where, limit: +limit, offset: (page-1)*limit,
      order: [['createdAt','DESC']],
      include: [{ model: User, as:'user', attributes:['id','firstName','lastName','email','phone'] }],
    });
    res.json({ success:true, orders, total:count, page:+page, pages:Math.ceil(count/limit) });
  } catch (err) { next(err); }
};

/** PUT /api/admin/orders/:id — Changer le statut d'une commande */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success:false, message:'Commande introuvable.' });
    const updates = {};
    if (status)        { updates.status = status;
      if (status==='shipped')   updates.shippedAt   = new Date();
      if (status==='delivered') updates.deliveredAt = new Date();
    }
    if (paymentStatus) { updates.paymentStatus = paymentStatus;
      if (paymentStatus==='paid') updates.paidAt = new Date();
    }
    await order.update(updates);
    res.json({ success:true, order });
  } catch (err) { next(err); }
};

/** GET /api/admin/customers */
exports.getCustomers = async (req, res, next) => {
  try {
    const { page=1, limit=20, search } = req.query;
    const where = { role:'customer' };
    if (search) where[Op.or] = [
      { firstName: { [Op.like]:`%${search}%` } },
      { email:     { [Op.like]:`%${search}%` } },
    ];
    const { rows:customers, count } = await User.findAll({
      where, limit:+limit, offset:(page-1)*limit, order:[['createdAt','DESC']],
    }).then ? { rows: await User.findAll({ where, limit:+limit, offset:(page-1)*limit }),
                count: await User.count({ where }) } : { rows:[], count:0 };
    res.json({ success:true, customers, total:count });
  } catch (err) { next(err); }
};

/** GET /api/admin/inventory */
exports.getInventory = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where  : { isActive:true },
      order  : [['stock','ASC']],
      attributes:['id','name','sku','stock','lowStockAlert','price'],
      include:[
        { association:'category', attributes:['name'] },
        { association:'brand',    attributes:['name'] },
        { association:'images', where:{isMain:true}, required:false, attributes:['url'] },
      ],
    });
    res.json({ success:true, products });
  } catch (err) { next(err); }
};

/** POST /api/admin/stock/:productId — Ajustement manuel du stock */
exports.adjustStock = async (req, res, next) => {
  try {
    const { quantity, type, reason } = req.body;
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ success:false, message:'Produit introuvable.' });

    const stockBefore = product.stock;
    const stockAfter  = type === 'in' ? stockBefore + quantity : Math.max(0, stockBefore - quantity);

    await product.update({ stock: stockAfter });
    await StockMovement.create({
      productId: product.id, userId: req.user.id,
      type, quantity: type==='in' ? quantity : -quantity,
      reason, stockBefore, stockAfter,
    });
    res.json({ success:true, product, stockBefore, stockAfter });
  } catch (err) { next(err); }
};

/** GET /api/admin/reviews — Modération des avis */
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where  : { isApproved: false },
      include: [
        { association:'user',    attributes:['id','firstName','lastName'] },
        { association:'product', attributes:['id','name'] },
      ],
    });
    res.json({ success:true, reviews });
  } catch (err) { next(err); }
};

/** PUT /api/admin/reviews/:id */
exports.approveReview = async (req, res, next) => {
  try {
    const r = await Review.findByPk(req.params.id);
    if (!r) return res.status(404).json({ success:false, message:'Avis introuvable.' });
    await r.update({ isApproved: req.body.isApproved, adminReply: req.body.adminReply });
    res.json({ success:true, review:r });
  } catch (err) { next(err); }
};
