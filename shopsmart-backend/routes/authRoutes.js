const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  signup,
  login,
  getMe,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' }
});

router.post(
  '/signup',
  authLimiter,
  [
    body().custom((value, { req }) => {
      if (!req.body.name && !req.body.username) {
        throw new Error('Name is required');
      }
      return true;
    }),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  signup
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.get('/me', protect, getMe);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

module.exports = router;