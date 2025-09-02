const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  previousEmail: { type: String },
  password: { type: String, required: true },
  // Support new roles (adopter, host) and keep old ones (customer, seller) for backward compatibility
  role: { type: String, enum: ['adopter', 'host', 'admin', 'customer', 'seller'], default: 'adopter' },
  isBlocked: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }, // admins can require approval for adopters
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
