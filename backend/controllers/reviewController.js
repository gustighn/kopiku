const { Review, Product, User, Order, OrderItem } = require('../models');
const sequelize = require('../config/database');

exports.createReview = async (req, res, next) => {
  try {
    const { product_id, rating, comment } = req.body;
    if (!product_id || !rating) {
      return res.status(400).json({ success: false, message: 'Produk dan rating wajib diisi.' });
    }
    // Check if user already reviewed
    const existingReview = await Review.findOne({ where: { user_id: req.user.id, product_id } });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Anda sudah memberikan review untuk produk ini.' });
    }
    // Check if user purchased the product
    const purchased = await Order.findOne({
      where: { user_id: req.user.id, status: 'completed' },
      include: [{ model: OrderItem, as: 'items', where: { product_id } }]
    });
    if (!purchased) {
      return res.status(400).json({ success: false, message: 'Anda harus membeli produk ini terlebih dahulu.' });
    }
    const review = await Review.create({ user_id: req.user.id, product_id, rating: parseInt(rating), comment });
    // Update product average rating
    const avgResult = await Review.findOne({
      where: { product_id },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']]
    });
    const avgRating = parseFloat(avgResult.getDataValue('avgRating')) || 0;
    await Product.update({ rating: avgRating.toFixed(1) }, { where: { id: product_id } });
    const fullReview = await Review.findByPk(review.id, { include: [{ model: User, as: 'user', attributes: ['id', 'name'] }] });
    res.status(201).json({ success: true, message: 'Review berhasil ditambahkan!', data: fullReview });
  } catch (error) {
    next(error);
  }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { product_id: req.params.productId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
