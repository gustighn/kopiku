const router = require('express').Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getWishlist);
router.post('/:productId', toggleWishlist);

module.exports = router;
