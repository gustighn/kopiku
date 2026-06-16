const router = require('express').Router();
const { createOrder, getUserOrders, getOrderDetail, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(auth);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/admin/all', admin, getAllOrders);
router.get('/:id', getOrderDetail);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
