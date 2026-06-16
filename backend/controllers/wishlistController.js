const { Wishlist, Product } = require('../models');

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product' }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    const existing = await Wishlist.findOne({ where: { user_id: req.user.id, product_id: productId } });
    if (existing) {
      await existing.destroy();
      return res.json({ success: true, message: 'Produk dihapus dari wishlist.', data: { wishlisted: false } });
    }
    await Wishlist.create({ user_id: req.user.id, product_id: productId });
    res.json({ success: true, message: 'Produk ditambahkan ke wishlist!', data: { wishlisted: true } });
  } catch (error) {
    next(error);
  }
};
