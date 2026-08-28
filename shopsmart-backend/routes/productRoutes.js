const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  createProductReview
} = require('../controllers/productController');
const { searchProducts } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required')
  ],
  createProduct
);

router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;