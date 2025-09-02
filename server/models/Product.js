const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
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
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
