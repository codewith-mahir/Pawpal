const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Made optional for guest donations
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: false }, // Made optional for website donations
    
    // New form fields
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    donationType: { type: String, enum: ['website', 'ngo'], required: true },
    selectedNgo: { type: String }, // Store NGO name as string for simplicity
    donationItems: { type: String, enum: ['products', 'money', 'other'] },
    donationAmount: { type: String }, // Store as string to handle various formats
    other: { type: String }, // Details for products or other donations
    
    // Legacy fields (keeping for backward compatibility)
    items: [{ type: String }], // Made optional for website donations
    notes: { type: String },
    deliveryMethod: { type: String, enum: ['pickup', 'dropoff'] }, // Made optional for website donations
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    adminComment: { type: String },
    scheduledAt: { type: Date },
    confirmedAt: { type: Date },
    
    // Website donation flag
    isWebsiteDonation: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', DonationSchema);
