const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
}

// @route  POST /api/wishlist
// @access Protected
const addToWishlist = asyncHandler(async (req, res) => {
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

  const wishlist = await getOrCreateWishlist(req.user.id);
  const alreadyExists = wishlist.products.some((p) => p.toString() === productId);

  if (!alreadyExists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  await wishlist.populate('products');
  res.status(200).json({ success: true, data: wishlist });
});

// @route  GET /api/wishlist
// @access Protected
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user.id);
  await wishlist.populate('products');
  res.status(200).json({ success: true, data: wishlist });
});

// @route  DELETE /api/wishlist/:productId
// @access Protected
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  const exists = wishlist?.products.some((p) => p.toString() === req.params.productId);

  if (!wishlist || !exists) {
    res.status(404);
    throw new Error('Item not found in wishlist');
  }

  wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
  await wishlist.save();
  await wishlist.populate('products');

  res.status(200).json({ success: true, data: wishlist });
});

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
