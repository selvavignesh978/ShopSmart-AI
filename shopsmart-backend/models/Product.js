const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    description: { type: String, default: '' },
    specs: { type: String, default: '' },
    features: [{ type: String }],
    image: { type: String, default: '/image/placeholder.jpg' },
    stock: { type: Number, default: 25, min: 0 },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    battery: { type: String, default: undefined },
    isPopular: { type: Boolean, default: false }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);