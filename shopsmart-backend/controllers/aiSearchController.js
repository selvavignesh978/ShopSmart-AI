const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { parseQuery, applyFilters } = require('../utils/aiSearchParser');

// @route   POST /api/ai-search
// @access  Public
// @body    { query: "budget laptop under 40k with best battery", context: { lastCategory, lastMaxPrice, ... } }
const aiSearch = asyncHandler(async (req, res) => {
  const { query, context = {} } = req.body;

  if (!query || !query.trim()) {
    res.status(400);
    throw new Error('A search query is required');
  }

  const parsed = parseQuery(query, context);
  const allProducts = await Product.find({}).lean();
  const results = applyFilters(allProducts, parsed);

  // Return a curated top selection (max 4 products) to avoid cluttering chat
  const topResults = results.slice(0, 4);

  if (topResults.length === 0) {
    const popularAlternatives = await Product.find({ isPopular: true }).limit(3).lean();
    return res.status(200).json({
      success: true,
      matched: false,
      message: "I couldn't find an exact match for those specific parameters. Here are top-rated alternatives from our catalog:",
      filters: parsed,
      data: popularAlternatives
    });
  }

  res.status(200).json({
    success: true,
    matched: true,
    message: `Found ${results.length} product(s) matching your criteria. Here are my top recommended picks:`,
    filters: parsed,
    totalMatches: results.length,
    data: topResults
  });
});

module.exports = { aiSearch };