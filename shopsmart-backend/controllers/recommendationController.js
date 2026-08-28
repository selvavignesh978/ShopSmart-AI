const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const ViewHistory = require('../models/ViewHistory');
const { getRecommendationsForUser } = require('../utils/recommendationLogic');

// @route  POST /api/history/view
// @access Protected
const logView = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await ViewHistory.create({
    user: req.user.id,
    product: productId,
    category: product.category
  });

  res.status(201).json({ success: true, message: 'View logged' });
});

// @route  GET /api/recommendations
// @access Protected
const getRecommendations = asyncHandler(async (req, res) => {
  const { basis, products, preferredCategories } = await getRecommendationsForUser(req.user.id);

  res.status(200).json({
    success: true,
    basis, // "history" | "popular"
    preferredCategories: preferredCategories || [],
    data: products
  });
});

module.exports = { logView, getRecommendations };
