/** Controller Panier — add, update, remove, clear, get */
const { Cart, CartItem, Product } = require('../models');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) cart = await Cart.create({ userId });
  return cart;
};

const getFullCart = async (userId) =>
  Cart.findOne({
    where  : { userId },
    include: [{
      model  : CartItem, as: 'items',
      include: [{ model: Product, as: 'product',
        attributes: ['id','name','price','stock','slug','isActive'],
        include: [{ association: 'images', where: { isMain:true }, required:false, attributes:['url'] }]
      }]
    }],
  });

/** GET /api/cart */
exports.getCart = async (req, res, next) => {
  try {
    const cart = await getFullCart(req.user.id);
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

/** POST /api/cart/items */
exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findByPk(productId);
    if (!product || !product.isActive)
      return res.status(404).json({ success: false, message: 'Produit indisponible.' });
    if (product.stock < quantity)
      return res.status(400).json({ success: false, message: `Stock insuffisant (${product.stock} disponible${product.stock>1?'s':''}).` });

    const cart = await getOrCreateCart(req.user.id);
    const [item, created] = await CartItem.findOrCreate({
      where   : { cartId: cart.id, productId },
      defaults: { quantity, priceSnapshot: product.price },
    });
    if (!created) {
      const newQty = item.quantity + parseInt(quantity);
      if (newQty > product.stock)
        return res.status(400).json({ success: false, message: 'Quantité demandée dépasse le stock.' });
      await item.update({ quantity: newQty, priceSnapshot: product.price });
    }
    const updatedCart = await getFullCart(req.user.id);
    res.json({ success: true, cart: updatedCart });
  } catch (err) { next(err); }
};

/** PUT /api/cart/items/:id */
exports.updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByPk(req.params.id, {
      include: [{ model: Product, as: 'product' }]
    });
    if (!item) return res.status(404).json({ success: false, message: 'Article introuvable.' });
    if (quantity < 1) { await item.destroy(); }
    else {
      if (quantity > item.product.stock)
        return res.status(400).json({ success: false, message: 'Stock insuffisant.' });
      await item.update({ quantity });
    }
    const cart = await getFullCart(req.user.id);
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

/** DELETE /api/cart/items/:id */
exports.removeItem = async (req, res, next) => {
  try {
    await CartItem.destroy({ where: { id: req.params.id } });
    const cart = await getFullCart(req.user.id);
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

/** DELETE /api/cart */
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ success: true, message: 'Panier vidé.' });
  } catch (err) { next(err); }
};
