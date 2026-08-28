const mongoose = require('mongoose');

const viewHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

viewHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ViewHistory', viewHistorySchema);
