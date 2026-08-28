// D:\finalproject\shopsmart-backend\controllers\paymentController.js
const asyncHandler = require('express-async-handler');
const stripe = require('../config/stripe');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Determine card type based on number pattern
const detectCardBrand = (cardNumber) => {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'Visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'American Express';
  if (/^6(?:011|5)/.test(clean)) return 'Discover';
  if (/^35/.test(clean)) return 'JCB';
  if (/^60|^65|^81|^82/.test(clean)) return 'RuPay';
  return 'Credit/Debit Card';
};

// @route   POST /api/payment/custom-card-pay
// @access  Protected
const payWithCustomCard = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingAddress, cardDetails } = req.body;

  if (!items || !items.length || !totalAmount) {
    res.status(400);
    throw new Error('Order items and total amount are required');
  }

  if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.pincode) {
    res.status(400);
    throw new Error('Complete delivery address is required');
  }

  if (!cardDetails?.cardNumber || cardDetails.cardNumber.replace(/\D/g, '').length < 13) {
    res.status(400);
    throw new Error('Please enter a valid card number (at least 13-16 digits)');
  }

  const cleanCard = cardDetails.cardNumber.replace(/\D/g, '');
  const last4 = cleanCard.slice(-4);
  const brand = cardDetails.brand || detectCardBrand(cleanCard);

  const order = await Order.create({
    user: req.user.id,
    items: items.map((item) => ({
      product: item.product || item.productId || item._id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity || 1),
      image: item.image || ''
    })),
    totalAmount: Number(totalAmount),
    shippingAddress,
    paymentIntentId: `PAY_MANUAL_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    paymentStatus: 'paid',
    cardDetails: {
      holderName: cardDetails.holderName || req.user.name || 'Cardholder',
      brand,
      last4,
      expMonth: cardDetails.expMonth || '',
      expYear: cardDetails.expYear || '',
      paymentMethodId: `CARD_${last4}`
    }
  });

  // Clear user's cart in database
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

  res.status(201).json({
    success: true,
    message: 'Payment completed successfully with custom card details',
    data: order
  });
});

// @route   POST /api/payment/create-order
// @access  Protected
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;

  if (!items || !items.length || !totalAmount) {
    res.status(400);
    throw new Error('Order items and total amount are required');
  }

  if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.pincode) {
    res.status(400);
    throw new Error('Complete shipping address is required');
  }

  const amountInPaise = Math.round(Number(totalAmount) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: 'inr',
    description: `ShopSmart Order for User: ${req.user.id}`,
    shipping: {
      name: req.user.name || 'ShopSmart Customer',
      address: {
        line1: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || 'Tamil Nadu',
        postal_code: String(shippingAddress.pincode),
        country: 'IN'
      }
    },
    metadata: { userId: req.user.id },
    automatic_payment_methods: { enabled: true }
  });

  const order = await Order.create({
    user: req.user.id,
    items: items.map((item) => ({
      product: item.product || item.productId || item._id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity || 1),
      image: item.image || ''
    })),
    totalAmount: Number(totalAmount),
    shippingAddress,
    paymentIntentId: paymentIntent.id,
    paymentStatus: 'pending'
  });

  res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    dbOrderId: order._id,
    amount: amountInPaise
  });
});

// @route   POST /api/payment/verify
// @access  Protected
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, dbOrderId, cardDetails } = req.body;

  let verifiedCard = cardDetails || null;

  if (!verifiedCard && paymentIntentId && !paymentIntentId.startsWith('PAY_MANUAL')) {
    try {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['payment_method']
      });
      if (intent?.payment_method?.card) {
        verifiedCard = {
          holderName: intent.payment_method.billing_details?.name || 'Cardholder',
          brand: intent.payment_method.card.brand,
          last4: intent.payment_method.card.last4,
          expMonth: intent.payment_method.card.exp_month,
          expYear: intent.payment_method.card.exp_year,
          paymentMethodId: intent.payment_method.id
        };
      }
    } catch (err) {
      console.warn('Stripe expand skipped:', err.message);
    }
  }

  const order = await Order.findOneAndUpdate(
    { _id: dbOrderId, user: req.user.id },
    { 
      paymentStatus: 'paid',
      ...(verifiedCard ? { cardDetails: verifiedCard } : {})
    },
    { new: true }
  );

  if (!order) {
    res.status(404);
    throw new Error('Order record not found for verification');
  }

  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

  res.status(200).json({
    success: true,
    message: 'Payment verified and order placed successfully',
    data: order
  });
});

// @route   GET /api/payment/my-orders
// @access  Protected
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name price image category');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @route   PUT /api/payment/orders/:orderId/cancel
// @access  Protected
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, user: req.user.id });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'cancelled') {
    res.status(400);
    throw new Error('Order is already cancelled');
  }

  order.paymentStatus = 'cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

// @route   PUT /api/payment/orders/:orderId/address
// @access  Protected
const updateOrderAddress = asyncHandler(async (req, res) => {
  const { street, city, state, pincode, landmark } = req.body;

  if (!street || !city || !pincode) {
    res.status(400);
    throw new Error('Street, city, and pincode are required');
  }

  const order = await Order.findOne({ _id: req.params.orderId, user: req.user.id });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.shippingAddress = {
    street,
    city,
    state: state || '',
    pincode,
    landmark: landmark || ''
  };

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Shipping address updated successfully',
    data: order
  });
});

module.exports = {
  createPaymentIntent,
  verifyPayment,
  payWithCustomCard,
  getMyOrders,
  cancelOrder,
  updateOrderAddress
};