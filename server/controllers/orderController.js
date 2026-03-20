/** Controller Commandes — create, list, detail, cancel, updateStatus */
const { Order, OrderItem, Cart, CartItem, Product, StockMovement, Coupon } = require('../models');
const { generateOrderNumber, applyCoupon } = require('../utils/helpers');
const sequelize = require('../config/database');

/** POST /api/orders */
exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { shippingAddress, notes, paymentMethod = 'cash_on_delivery', couponCode } = req.body;
    const cart = await Cart.findOne({
      where  : { userId: req.user.id },
      include: [{ model: CartItem, as: 'items',
        include: [{ model: Product, as: 'product' }] }],
      transaction: t,
    });
    if (!cart?.items?.length) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Votre panier est vide.' });
    }
    // Vérif stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ success: false,
          message: `Stock insuffisant pour "${item.product.name}".` });
      }
    }
    const subtotal = cart.items.reduce((s, i) => s + parseFloat(i.priceSnapshot) * i.quantity, 0);
    // Coupon
    let discountAmount = 0, coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ where: { code: couponCode.toUpperCase(), isActive: true } });
      if (coupon) discountAmount = applyCoupon(coupon, subtotal);
    }
    const total = Math.max(0, subtotal - discountAmount);

    // Créer la commande
    const order = await Order.create({
      userId: req.user.id, orderNumber: generateOrderNumber(),
      subtotal, discountAmount, total, notes, paymentMethod, couponCode,
      shipName   : shippingAddress?.recipientName,
      shipPhone  : shippingAddress?.phone,
      shipStreet : shippingAddress?.street,
      shipCity   : shippingAddress?.city,
      shipCountry: shippingAddress?.country || 'Cameroun',
    }, { transaction: t });

    // Créer les OrderItems + décrémenter stock
    for (const item of cart.items) {
      await OrderItem.create({
        orderId: order.id, productId: item.productId,
        productName: item.product.name, productSku: item.product.sku,
        quantity: item.quantity, unitPrice: item.priceSnapshot,
        totalPrice: parseFloat(item.priceSnapshot) * item.quantity,
      }, { transaction: t });

      const newStock = item.product.stock - item.quantity;
      await item.product.update({
        stock: newStock, soldCount: item.product.soldCount + item.quantity
      }, { transaction: t });
      await StockMovement.create({
        productId: item.productId, type: 'sale', quantity: -item.quantity,
        reference: order.orderNumber, stockBefore: item.product.stock, stockAfter: newStock,
      }, { transaction: t });
    }

    // Incrémenter coupon
    if (coupon) await coupon.increment('usedCount', { transaction: t });
    // Vider le panier
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
    await t.commit();

    const fullOrder = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
    res.status(201).json({ success: true, order: fullOrder });
  } catch (err) { await t.rollback(); next(err); }
};

/** GET /api/orders (mes commandes) */
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where  : { userId: req.user.id },
      order  : [['createdAt','DESC']],
      include: [{ model: OrderItem, as: 'items' }],
    });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};

/** GET /api/orders/:id */
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where  : { id: req.params.id, userId: req.user.id },
      include: [{ model: OrderItem, as: 'items',
        include: [{ model: Product, as: 'product',
          attributes: ['id','name','slug'],
          include: [{ association: 'images', where:{isMain:true}, required:false, attributes:['url'] }]
        }]
      }],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

/** PUT /api/orders/:id/cancel */
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id },
      include: [{ model: OrderItem, as: 'items' }] });
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    if (!['pending','confirmed'].includes(order.status))
      return res.status(400).json({ success: false, message: 'Cette commande ne peut plus être annulée.' });
    await order.update({ status: 'cancelled' });
    // Réintégrer le stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        const newStock = product.stock + item.quantity;
        await StockMovement.create({
          productId: item.productId, type: 'return', quantity: item.quantity,
          reference: order.orderNumber, stockBefore: product.stock, stockAfter: newStock,
        });
        await product.update({ stock: newStock });
      }
    }
    res.json({ success: true, message: 'Commande annulée.' });
  } catch (err) { next(err); }
};
