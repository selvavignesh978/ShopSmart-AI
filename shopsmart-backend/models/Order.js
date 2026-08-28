// D:\finalproject\shopsmart-backend\models\Order.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    pincode: { type: String, required: true },
    landmark: { type: String, default: '' }
  },
  { _id: false }
);

const cardDetailsSchema = new mongoose.Schema(
  {
    holderName: { type: String, default: '' },
    brand: { type: String, default: 'Custom Card' },
    last4: { type: String, default: '' },
    expMonth: { type: String, default: '' },
    expYear: { type: String, default: '' },
    paymentMethodId: { type: String, default: '' }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        image: { type: String, default: '' }
      }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: addressSchema, required: true },
    paymentIntentId: { type: String, required: true, index: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending'
    },
    cardDetails: { type: cardDetailsSchema, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);