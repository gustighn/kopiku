const bcrypt = require('bcryptjs');
require('dotenv').config();
const { sequelize, User, Product, Cart, Coupon } = require('../models');

const seed = async () => {
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database synced!');

    // Create admin
    const adminPass = await bcrypt.hash('admin123', 10);
    const admin = await User.create({ name: 'Admin Kopiku', email: 'admin@kopiku.com', password: adminPass, role: 'admin' });
    await Cart.create({ user_id: admin.id });

    // Create user
    const userPass = await bcrypt.hash('user123', 10);
    const user = await User.create({ name: 'User Demo', email: 'user@kopiku.com', password: userPass, role: 'user' });
    await Cart.create({ user_id: user.id });

    console.log('Users seeded!');

    // Create products
    await Product.bulkCreate([
      {
        name: 'Avocado Coffee',
        description: 'Perpaduan unik alpukat segar dengan espresso premium, menciptakan rasa creamy dan menyegarkan. Minuman signature yang wajib dicoba untuk pecinta kopi dan alpukat.',
        price: 28000,
        stock: 50,
        image: 'avocado-coffee.jpg',
        category: 'Specialty',
        rating: 4.8
      },
      {
        name: 'Cappuccino',
        description: 'Cappuccino klasik dengan foam susu lembut dan taburan bubuk coklat di atasnya. Keseimbangan sempurna antara espresso kuat dan kelembutan susu.',
        price: 25000,
        stock: 100,
        image: 'cappuccino.jpg',
        category: 'Espresso',
        rating: 4.5
      },
      {
        name: 'Iced Latte',
        description: 'Espresso dengan susu dingin yang menyegarkan, cocok untuk menemani hari-harimu. Rasa kopi yang smooth dan creamy dalam setiap tegukan.',
        price: 22000,
        stock: 80,
        image: 'iced-latte.jpg',
        category: 'Latte',
        rating: 4.6
      },
      {
        name: 'Kopi Pandan Latte',
        description: 'Kombinasi unik pandan dan kopi yang menghasilkan rasa harum dan creamy. Cita rasa Nusantara yang dibalut dalam segelas kopi modern.',
        price: 26000,
        stock: 60,
        image: 'kopi-pandan-latte.jpg',
        category: 'Specialty',
        rating: 4.7
      },
      {
        name: 'Kopi Susu Gula Aren',
        description: 'Kopi susu dengan manisnya gula aren asli, favorit sepanjang masa. Perpaduan kopi robusta pilihan dengan gula aren premium dari Sulawesi.',
        price: 24000,
        stock: 120,
        image: 'kopi-susu-gula-aren.jpg',
        category: 'Signature',
        rating: 4.9
      }
    ]);
    console.log('Products seeded!');

    // Create coupons
    const now = new Date();
    await Coupon.bulkCreate([
      { code: 'KOPIKU10', discount: 10, expired_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
      { code: 'WELCOME20', discount: 20, expired_at: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) }
    ]);
    console.log('Coupons seeded!');

    console.log('\n=== Seed completed! ===');
    console.log('Admin: admin@kopiku.com / admin123');
    console.log('User:  user@kopiku.com / user123');
    console.log('Coupons: KOPIKU10 (10%), WELCOME20 (20%)');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
