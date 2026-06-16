const router = require('express').Router();
const { validateCoupon, getAllCoupons, createCoupon, deleteCoupon } = require('../controllers/couponController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/validate', auth, validateCoupon);
router.get('/', auth, admin, getAllCoupons);
router.post('/', auth, admin, createCoupon);
router.delete('/:id', auth, admin, deleteCoupon);

module.exports = router;
