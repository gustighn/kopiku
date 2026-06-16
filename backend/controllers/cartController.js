const { Cart, CartItem, Product } = require('../models');

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
      cart = await Cart.findOne({
        where: { id: cart.id },
        include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
      });
    }
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
    res.json({ success: true, data: { ...cart.toJSON(), totalItems, totalPrice } });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Stok tidak mencukupi.' });
    let cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) cart = await Cart.create({ user_id: req.user.id });
    let cartItem = await CartItem.findOne({ where: { cart_id: cart.id, product_id } });
    if (cartItem) {
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cart_id: cart.id, product_id, quantity: parseInt(quantity) });
    }
    res.json({ success: true, message: 'Produk ditambahkan ke keranjang!', data: cartItem });
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findByPk(req.params.itemId, { include: [{ model: Cart, where: { user_id: req.user.id } }] });
    if (!cartItem) return res.status(404).json({ success: false, message: 'Item tidak ditemukan.' });
    if (quantity <= 0) {
      await cartItem.destroy();
      return res.json({ success: true, message: 'Item dihapus dari keranjang.' });
    }
    cartItem.quantity = parseInt(quantity);
    await cartItem.save();
    res.json({ success: true, message: 'Keranjang diperbarui!', data: cartItem });
  } catch (error) {
    next(error);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) return res.status(404).json({ success: false, message: 'Keranjang tidak ditemukan.' });
    const cartItem = await CartItem.findOne({ where: { id: req.params.itemId, cart_id: cart.id } });
    if (!cartItem) return res.status(404).json({ success: false, message: 'Item tidak ditemukan.' });
    await cartItem.destroy();
    res.json({ success: true, message: 'Item dihapus dari keranjang!' });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (cart) await CartItem.destroy({ where: { cart_id: cart.id } });
    res.json({ success: true, message: 'Keranjang dikosongkan!' });
  } catch (error) {
    next(error);
  }
};
