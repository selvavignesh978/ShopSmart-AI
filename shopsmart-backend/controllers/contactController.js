const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');

// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, subject, message } = req.body;

  const contactEntry = await Contact.create({
    name,
    email: email.toLowerCase(),
    subject: subject || 'Support',
    message
  });

  res.status(201).json({
    success: true,
    message: 'Contact submission saved successfully',
    data: contactEntry
  });
});

module.exports = { submitContactForm };