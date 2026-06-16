const { Op } = require('sequelize');
const { Product, Review, User } = require('../models');
const fs = require('fs');
const path = require('path');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    if (rating) where.rating = { [Op.gte]: parseFloat(rating) };

    let order = [['created_at', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    else if (sort === 'price_desc') order = [['price', 'DESC']];
    else if (sort === 'rating') order = [['rating', 'DESC']];
    else if (sort === 'name') order = [['name', 'ASC']];

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Product.findAndCountAll({
      where, order, limit: parseInt(limit), offset
    });
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review, as: 'reviews', include: [{ model: User, as: 'user', attributes: ['id', 'name'] }], order: [['created_at', 'DESC']] }]
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Nama dan harga produk wajib diisi.' });
    }
    const productData = { name, description, price: parseFloat(price), stock: parseInt(stock) || 0, category };
    if (req.file) productData.image = req.file.filename;
    const product = await Product.create(productData);
    res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan!', data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }
    const { name, description, price, stock, category } = req.body;
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category) product.category = category;
    if (req.file) {
      if (product.image) {
        const oldPath = path.join(__dirname, '..', 'uploads', 'products', product.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.image = req.file.filename;
    }
    await product.save();
    res.json({ success: true, message: 'Produk berhasil diperbarui!', data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }
    if (product.image) {
      const imgPath = path.join(__dirname, '..', 'uploads', 'products', product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await product.destroy();
    res.json({ success: true, message: 'Produk berhasil dihapus!' });
  } catch (error) {
    next(error);
  }
};
