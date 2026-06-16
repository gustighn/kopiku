const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Cart } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  secure: process.env.NODE_ENV === 'production'
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    await Cart.create({ user_id: user.id });
    const token = generateToken(user.id);
    res.cookie('token', token, cookieOptions);
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      data: { id: user.id, name: user.name, email: user.email, role: user.role, token }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }
    const token = generateToken(user.id);
    res.cookie('token', token, cookieOptions);
    res.json({
      success: true,
      message: 'Login berhasil!',
      data: { id: user.id, name: user.name, email: user.email, role: user.role, token }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.cookie('token', '', { 
    httpOnly: true, 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0) 
  });
  res.json({ success: true, message: 'Logout berhasil!' });
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role }
    });
  } catch (error) {
    next(error);
  }
};
