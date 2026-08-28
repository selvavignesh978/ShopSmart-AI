const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @route  GET /api/products/search?q=keyword
// @access Public
const searchProducts = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();

  if (!q) {
    return res.status(200).json({ success: true, data: [] });
  }

  const regex = new RegExp(q, 'i');
  const products = await Product.find({
    $or: [{ name: regex }, { description: regex }]
  });

  res.status(200).json({ success: true, data: products });
});

module.exports = { searchProducts };
