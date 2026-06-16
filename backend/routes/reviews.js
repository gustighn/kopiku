const router = require('express').Router();
const { createReview, getProductReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, createReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;
