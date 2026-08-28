const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret_placeholder', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

// @route  POST /api/auth/signup
// @access Public
const signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Accepts both name and username for frontend compatibility
  const name = req.body.name || req.body.username;
  const { email, password, mobile, dob } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    mobile: mobile || '',
    dob: dob ? new Date(dob) : undefined,
    addresses: []
  });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      token
    }
  });
});

// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      token
    }
  });
});

// @route  GET /api/auth/me
// @access Protected
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      dob: user.dob,
      addresses: user.addresses || []
    }
  });
});

// @route  POST /api/auth/address
// @access Protected
const addAddress = asyncHandler(async (req, res) => {
  const { street, city, state, pincode, landmark, isDefault } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.addresses) {
    user.addresses = [];
  }

  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  const newAddr = {
    street,
    city,
    state: state || '',
    pincode,
    landmark: landmark || '',
    isDefault: isDefault || user.addresses.length === 0
  };

  user.addresses.push(newAddr);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address saved successfully',
    data: user.addresses
  });
});

// @route  PUT /api/auth/address/:addressId
// @access Protected
const updateAddress = asyncHandler(async (req, res) => {
  const { street, city, state, pincode, landmark, isDefault } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  if (street !== undefined) address.street = street;
  if (city !== undefined) address.city = city;
  if (state !== undefined) address.state = state;
  if (pincode !== undefined) address.pincode = pincode;
  if (landmark !== undefined) address.landmark = landmark;
  if (isDefault !== undefined) address.isDefault = isDefault;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: user.addresses
  });
});

// @route  DELETE /api/auth/address/:addressId
// @access Protected
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const addressIndex = user.addresses.findIndex(
    (addr) => addr._id.toString() === req.params.addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error('Address not found');
  }

  const wasDefault = user.addresses[addressIndex].isDefault;
  user.addresses.splice(addressIndex, 1);

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    data: user.addresses
  });
});

module.exports = {
  signup,
  login,
  getMe,
  addAddress,
  updateAddress,
  deleteAddress
};