const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    pincode: { type: String, required: true },
    landmark: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    mobile: { type: String, trim: true, default: '' },
    dob: { type: Date },
    addresses: [addressSchema],
    viewedCategories: [{ type: String }],
    purchasedCategories: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);