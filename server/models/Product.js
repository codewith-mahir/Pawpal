const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // New canonical owner field
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Legacy owner field (kept for backward compatibility)
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  amount: { type: String, required: true }, // price as string as per existing data
  imageUrl: String,
  category: { type: String, default: 'General' },
  // analytics fields
  viewCount: { type: Number, default: 0 },
  aiCategory: { type: String },
  breed: { type: String },
  isSold: { type: Boolean, default: false },
  soldAt: { type: Date },
  // New canonical adopter field for who adopted the pet
  adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Legacy buyer field
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
