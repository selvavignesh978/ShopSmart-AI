const express = require('express');
const { getCategories } = require('../controllers/productController');

const router = express.Router();

// GET /api/categories - list all distinct product categories
router.get('/', getCategories);

module.exports = router;
