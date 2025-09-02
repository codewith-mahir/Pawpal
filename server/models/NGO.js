const mongoose = require('mongoose');

const NGOSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    isVerified: { type: Boolean, default: true },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NGO', NGOSchema);
