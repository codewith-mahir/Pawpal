const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  proofUrl: { type: String },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  adminReply: { type: String },
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
