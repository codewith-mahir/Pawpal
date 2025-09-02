const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // New canonical owner field
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Legacy owner field (kept for backward compatibility)
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

// Ensure hostId/sellerId and adopterId/buyerId are mirrored for compatibility
ProductSchema.pre('validate', function(next) {
  try {
    if (this.hostId && !this.sellerId) this.sellerId = this.hostId;
    if (this.sellerId && !this.hostId) this.hostId = this.sellerId;
    if (this.adopterId && !this.buyerId) this.buyerId = this.adopterId;
    if (this.buyerId && !this.adopterId) this.adopterId = this.buyerId;
  } catch (e) { /* no-op */ }
  next();
});

// Include both legacy and new ids in JSON responses
ProductSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    if (ret.hostId && !ret.sellerId) ret.sellerId = ret.hostId;
    if (ret.sellerId && !ret.hostId) ret.hostId = ret.sellerId;
    if (ret.adopterId && !ret.buyerId) ret.buyerId = ret.adopterId;
    if (ret.buyerId && !ret.adopterId) ret.adopterId = ret.buyerId;
    return ret;
  },
});

module.exports = mongoose.model('Product', ProductSchema);
