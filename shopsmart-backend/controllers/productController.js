const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Product = require('../models/Product');

const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const {
    name,
    price,
    category,
    description,
    image,
    stock,
    specs,
    features,
    rating,
    battery,
    isPopular
  } = req.body;

  const product = await Product.create({
    name,
    price: Number(price),
    category,
    description: description || '',
    image: image || '/image/placeholder.jpg',
    stock: stock !== undefined && stock !== null ? Number(stock) : 25,
    specs: specs || '',
    features: Array.isArray(features) ? features : [],
    rating: rating ? Number(rating) : 4.0,
    battery: battery || undefined,
    isPopular: Boolean(isPopular)
  });

  res.status(201).json({ success: true, data: product });
});

const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, sort } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 100);

  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'priceAsc') sortOption = { price: 1 };
  if (sort === 'priceDesc') sortOption = { price: -1 };
  if (sort === 'ratingDesc') sortOption = { rating: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatable = [
    'name',
    'price',
    'category',
    'description',
    'image',
    'stock',
    'specs',
    'features',
    'rating',
    'battery',
    'isPopular'
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  await product.save();
  res.status(200).json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted', data: { id: req.params.id } });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.status(200).json({ success: true, data: categories });
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user && r.user.toString() === req.user.id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    name: req.user.name || 'Verified Buyer',
    rating: Number(rating),
    comment: comment || '',
    user: req.user.id
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added successfully', data: product });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  createProductReview
};