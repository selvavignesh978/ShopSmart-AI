const express = require('express');
const { addToCart, getCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', addToCart);
router.get('/', getCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);

module.exports = router;
