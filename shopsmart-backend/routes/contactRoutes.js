const express = require('express');
const { body } = require('express-validator');
const { submitContactForm } = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email address is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  submitContactForm
);

module.exports = router;