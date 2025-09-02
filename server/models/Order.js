const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    amount: String,
    quantity: { type: Number, default: 1 },
    imageUrl: String,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    deliveryTracking: {
      carrier: String,
      trackingNumber: String,
      eta: Date,
      history: [
        {
          status: String,
          note: String,
          at: { type: Date, default: Date.now },
        },
      ],
    },
    shipping: {
      name: String,
      email: String,
      address: String,
      city: String,
      country: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
