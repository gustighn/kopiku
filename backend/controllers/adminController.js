const { Op, fn, col, literal } = require('sequelize');
const { User, Product, Order, OrderItem } = require('../models');
const sequelize = require('../config/database');

exports.getDashboard = async (req, res, next) => {
  try {
    const totalProducts = await Product.count();
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalOrders = await Order.count();
    const revenueResult = await Order.findOne({
      attributes: [[fn('COALESCE', fn('SUM', col('total_price')), 0), 'total']],
      where: { status: { [Op.ne]: 'pending' } }
    });
    const totalRevenue = parseFloat(revenueResult.getDataValue('total')) || 0;
    res.json({ success: true, data: { totalProducts, totalUsers, totalOrders, totalRevenue } });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role tidak valid.' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    user.role = role;
    await user.save();
    res.json({ success: true, message: 'Role user diperbarui!', data: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Tidak dapat menghapus admin.' });
    await user.destroy();
    res.json({ success: true, message: 'User berhasil dihapus!' });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    // Sales per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dailySales = await Order.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('total_price')), 'revenue']
      ],
      where: { created_at: { [Op.gte]: thirtyDaysAgo }, status: { [Op.ne]: 'pending' } },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      raw: true
    });
    // Top 5 products by orders
    const topProducts = await OrderItem.findAll({
      attributes: ['product_id', [fn('SUM', col('quantity')), 'total_sold']],
      include: [{ model: Product, as: 'product', attributes: ['name'] }],
      group: ['product_id', 'product.id', 'product.name'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });
    // Monthly revenue (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const monthlyRevenue = await Order.findAll({
      attributes: [
        [fn('YEAR', col('created_at')), 'year'],
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('total_price')), 'revenue']
      ],
      where: { created_at: { [Op.gte]: twelveMonthsAgo }, status: { [Op.ne]: 'pending' } },
      group: [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))],
      order: [[fn('YEAR', col('created_at')), 'ASC'], [fn('MONTH', col('created_at')), 'ASC']],
      raw: true
    });
    res.json({ success: true, data: { dailySales, topProducts, monthlyRevenue } });
  } catch (error) {
    next(error);
  }
};
