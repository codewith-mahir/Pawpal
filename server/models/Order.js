const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    amount: String,
    quantity: { type: Number, default: 1 },
    imageUrl: String,
    // legacy owner of product
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // new canonical name
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    // legacy buyer
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // new canonical buyer
    adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

// Mirror legacy and new fields for compatibility
OrderSchema.pre('validate', function(next) {
  try {
    if (this.adopterId && !this.customerId) this.customerId = this.adopterId;
    if (this.customerId && !this.adopterId) this.adopterId = this.customerId;
    if (Array.isArray(this.items)) {
      this.items = this.items.map((it) => {
        if (!it) return it;
        if (it.hostId && !it.sellerId) it.sellerId = it.hostId;
        if (it.sellerId && !it.hostId) it.hostId = it.sellerId;
        return it;
      });
    }
  } catch (e) { /* no-op */ }
  next();
});

OrderSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    if (ret.adopterId && !ret.customerId) ret.customerId = ret.adopterId;
    if (ret.customerId && !ret.adopterId) ret.adopterId = ret.customerId;
    if (Array.isArray(ret.items)) {
      ret.items = ret.items.map((it) => {
        if (!it) return it;
        if (it.hostId && !it.sellerId) it.sellerId = it.hostId;
        if (it.sellerId && !it.hostId) it.hostId = it.sellerId;
        return it;
      });
    }
    return ret;
  },
});

module.exports = mongoose.model('Order', OrderSchema);
