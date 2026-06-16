const { Op } = require('sequelize');
const { Coupon } = require('../models');

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Kode kupon wajib diisi.' });
    const coupon = await Coupon.findOne({ where: { code: code.toUpperCase() } });
    if (!coupon) return res.status(404).json({ success: false, message: 'Kode kupon tidak ditemukan.' });
    if (new Date(coupon.expired_at) < new Date()) {
      return res.status(400).json({ success: false, message: 'Kupon sudah kedaluwarsa.' });
    }
    res.json({ success: true, message: 'Kupon valid!', data: { code: coupon.code, discount: coupon.discount } });
  } catch (error) {
    next(error);
  }
};

exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discount, expired_at } = req.body;
    if (!code || !discount || !expired_at) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }
    const coupon = await Coupon.create({ code: code.toUpperCase(), discount: parseFloat(discount), expired_at });
    res.status(201).json({ success: true, message: 'Kupon berhasil dibuat!', data: coupon });
  } catch (error) {
    next(error);
  }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Kupon tidak ditemukan.' });
    await coupon.destroy();
    res.json({ success: true, message: 'Kupon berhasil dihapus!' });
  } catch (error) {
    next(error);
  }
};
