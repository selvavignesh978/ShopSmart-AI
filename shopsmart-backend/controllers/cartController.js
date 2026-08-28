const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

// @route  POST /api/cart
// @access Protected
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const cart = await getOrCreateCart(req.user.id);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += Number(quantity) || 1;
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) || 1 });
  }

  await cart.save();
  await cart.populate('items.product');

  // Purge any orphan items whose product was removed
  cart.items = cart.items.filter((item) => item.product != null);

  res.status(200).json({ success: true, data: cart });
});

// @route  GET /api/cart
// @access Protected
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  await cart.populate('items.product');
  
  // Filter out any dangling deleted products
  const validItems = cart.items.filter((item) => item.product != null);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  res.status(200).json({ success: true, data: cart });
});

// @route  PUT /api/cart/:productId
// @access Protected
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('A valid quantity (>= 1) is required');
  }

  const cart = await Cart.findOne({ user: req.user.id });
  const item = cart?.items.find((i) => i.product.toString() === req.params.productId);

  if (!cart || !item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = Number(quantity);
  await cart.save();
  await cart.populate('items.product');
  cart.items = cart.items.filter((i) => i.product != null);

  res.status(200).json({ success: true, data: cart });
});

// @route  DELETE /api/cart/:productId
// @access Protected
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  const itemExists = cart?.items.some((i) => i.product.toString() === req.params.productId);

  if (!cart || !itemExists) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate('items.product');
  cart.items = cart.items.filter((i) => i.product != null);

  res.status(200).json({ success: true, data: cart });
});

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };