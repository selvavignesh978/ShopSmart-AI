// D:\finalproject\shopsmart-backend\routes\paymentRoutes.js
const express = require('express');
const {
  createPaymentIntent,
  verifyPayment,
  payWithCustomCard,
  getMyOrders,
  cancelOrder,
  updateOrderAddress
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create-order', createPaymentIntent);
router.post('/verify', verifyPayment);
router.post('/custom-card-pay', payWithCustomCard);
router.get('/my-orders', getMyOrders);
router.put('/orders/:orderId/cancel', cancelOrder);
router.put('/orders/:orderId/address', updateOrderAddress);

module.exports = router;