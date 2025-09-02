const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  previousEmail: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  isBlocked: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }, // admins can require approval for adopters
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
