const { Op } = require('sequelize');
const { Order, OrderItem, Cart, CartItem, Product, Coupon, User } = require('../models');
const sequelize = require('../config/database');

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { address, phone, payment_method, coupon_code } = req.body;
    if (!address || !phone || !payment_method) {
      return res.status(400).json({ success: false, message: 'Alamat, telepon, dan metode pembayaran wajib diisi.' });
    }
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong.' });
    }
    // Validate stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Stok ${item.product.name} tidak mencukupi.` });
      }
    }
    let totalPrice = cart.items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
    let discount = 0;
    // Apply coupon
    if (coupon_code) {
      const coupon = await Coupon.findOne({ where: { code: coupon_code, expired_at: { [Op.gt]: new Date() } } });
      if (coupon) {
        discount = totalPrice * (parseFloat(coupon.discount) / 100);
        totalPrice -= discount;
      }
    }
    const order = await Order.create({
      user_id: req.user.id, total_price: totalPrice, address, phone, payment_method, coupon_code, discount
    }, { transaction: t });
    // Create order items and reduce stock
    for (const item of cart.items) {
      await OrderItem.create({
        order_id: order.id, product_id: item.product_id, quantity: item.quantity, price: parseFloat(item.product.price)
      }, { transaction: t });
      await Product.update(
        { stock: item.product.stock - item.quantity },
        { where: { id: item.product_id }, transaction: t }
      );
    }
    // Clear cart
    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat!', data: fullOrder });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrderDetail = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    if (!order) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    order.status = status;
    await order.save();
    res.json({ success: true, message: 'Status pesanan diperbarui!', data: order });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = {};
    if (status) where.status = status;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    res.json({
      success: true, data: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
    });
  } catch (error) {
    next(error);
  }
};
