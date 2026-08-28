const Product = require('../models/Product');
const ViewHistory = require('../models/ViewHistory');
const Cart = require('../models/Cart');

/**
 * Builds a lightweight preference profile for a user from their view history,
 * then recommends products from their top categories, excluding items already
 * in their cart. Falls back to popular products for users with no history.
 */
async function getRecommendationsForUser(userId, limit = 8) {
  const history = await ViewHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(50);

  const cart = await Cart.findOne({ user: userId });
  const excludedProductIds = (cart?.items || []).map((item) => item.product.toString());

  if (history.length === 0) {
    // brand-new user: fall back to popular / top-rated products
    const popular = await Product.find({ _id: { $nin: excludedProductIds } })
      .sort({ isPopular: -1, rating: -1 })
      .limit(limit);
    return { basis: 'popular', products: popular };
  }

  // Weight categories by frequency of views
  const categoryCounts = {};
  history.forEach((h) => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const rankedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  const recommended = await Product.find({
    category: { $in: rankedCategories },
    _id: { $nin: excludedProductIds }
  })
    .sort({ rating: -1 })
    .limit(limit);

  if (recommended.length === 0) {
    const popular = await Product.find({ _id: { $nin: excludedProductIds } })
      .sort({ isPopular: -1, rating: -1 })
      .limit(limit);
    return { basis: 'popular', products: popular };
  }

  return { basis: 'history', preferredCategories: rankedCategories, products: recommended };
}

module.exports = { getRecommendationsForUser };
