const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendEmail } = require('../utils/mailer');

exports.createOrder = async (req, res) => {
  try {
    const { items, shipping } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items' });
    }

    // Fetch product details and compute total
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).populate('sellerId', 'email name');

    const orderItems = items.map((i) => {
      const p = products.find((pp) => String(pp._id) === String(i.productId));
      if (!p) return null;
      return {
        product: p._id,
        name: p.name,
        amount: p.amount,
        quantity: i.quantity || 1,
        imageUrl: p.imageUrl,
        sellerId: p.sellerId?._id,
      };
    }).filter(Boolean);

    if (orderItems.length === 0) return res.status(400).json({ message: 'Invalid items' });

    // amount is string; parse to number safely, non-numeric treated as 0
    const toNum = (s) => {
      const n = Number(String(s).replace(/[^0-9.]/g, ''));
      return isNaN(n) ? 0 : n;
    };
    const total = orderItems.reduce((sum, it) => sum + toNum(it.amount) * (it.quantity || 1), 0);

    const order = new Order({
      customerId: req.user._id,
      items: orderItems,
      total,
      shipping,
      status: 'pending',
      deliveryTracking: { history: [{ status: 'pending', note: 'Order created' }] },
    });

    // Ensure single-purchase: mark products as sold if not already
    const session = await Product.startSession();
    try {
      await session.withTransaction(async () => {
        // Re-check and mark sold
        for (const it of orderItems) {
          const updated = await Product.findOneAndUpdate(
            { _id: it.product, isSold: { $ne: true } },
            { $set: { isSold: true, soldAt: new Date(), buyerId: req.user._id } },
            { new: true, session }
          );
          if (!updated) {
            const err = new Error('One or more items are no longer available');
            err.status = 409;
            throw err;
          }
        }
        await order.save({ session });
      });
    } finally {
      session.endSession();
    }

    // Send confirmation email to customer
    try {
      await sendEmail(
        shipping?.email,
        'Order Confirmation',
        `Thank you for your order! Your order ID is ${order._id}. Total: ${total}`
      );
    } catch (e) {
      // ignore email errors in order flow
      console.warn('Email send failed:', e?.message || e);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('createOrder error', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customerId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, carrier, trackingNumber, eta } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });

    if (status) order.status = status;
    if (!order.deliveryTracking) order.deliveryTracking = { history: [] };
    if (carrier) order.deliveryTracking.carrier = carrier;
    if (trackingNumber) order.deliveryTracking.trackingNumber = trackingNumber;
    if (eta) order.deliveryTracking.eta = eta;

    order.deliveryTracking.history.push({ status: status || order.status, note });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Customer cancel order: revert sold status back to available
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customerId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Not found' });
    if (order.status === 'cancelled') return res.json(order);

    order.status = 'cancelled';
    if (!order.deliveryTracking) order.deliveryTracking = { history: [] };
    order.deliveryTracking.history.push({ status: 'cancelled', note: 'Order cancelled by customer' });

    const session = await Product.startSession();
    try {
      await session.withTransaction(async () => {
        await order.save({ session });
        // Revert products to available
        for (const it of order.items || []) {
          await Product.updateOne(
            { _id: it.product, buyerId: order.customerId },
            { $set: { isSold: false, soldAt: null, buyerId: null } },
            { session }
          );
        }
      });
    } finally {
      session.endSession();
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
