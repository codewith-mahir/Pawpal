const User = require('../models/User');
const Product = require('../models/Product');
const Complaint = require('../models/Complaint');
const BannedEmail = require('../models/BannedEmail');
const path = require('path');

exports.getAllUsers = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const q = (req.query.q || '').trim();
  const filter = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];
  }
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ data: users, total, page, limit });
};

exports.getAllProducts = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const q = (req.query.q || '').trim();
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { aiCategory: { $regex: q, $options: 'i' } },
        { breed: { $regex: q, $options: 'i' } },
      ];
    }
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ data: products, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const q = (req.query.q || '').trim();
  const filter = {};
  if (q) {
    filter.message = { $regex: q, $options: 'i' };
  }
  const total = await Complaint.countDocuments(filter);
  const complaints = await Complaint.find(filter)
  .populate('userId', 'name email')
  .populate('productId', 'name')
  .populate('orderId', '_id status')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ data: complaints, total, page, limit });
};

exports.promoteUserToAdmin = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = 'admin';
  await user.save();

  res.json({ message: `User ${user.name} promoted to admin` });
};

// Block/unblock user
exports.setUserBlocked = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { userId } = req.params;
  const { blocked } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isBlocked = Boolean(blocked);
  await user.save();
  const email = String(user.email).toLowerCase().trim();
  if (user.isBlocked) {
    await BannedEmail.updateOne({ email }, { $set: { email } }, { upsert: true });
  } else {
    await BannedEmail.deleteOne({ email });
  }
  res.json({ message: `User ${blocked ? 'blocked and banned' : 'unblocked and unbanned'}` });
};

// Approve/unapprove adopters (customers)
exports.setUserApproved = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { userId } = req.params;
  const { approved } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const wantApproved = Boolean(approved);
  if (!wantApproved) {
    // Disable account but allow re-registration with the same email.
    // We free up the current email by moving it to previousEmail and assigning a unique placeholder.
    if (user.isApproved !== false) {
      const normalizedEmail = String(user.email).toLowerCase().trim();
      if (!user.previousEmail) user.previousEmail = normalizedEmail;
      // Assign a unique disabled email to satisfy unique constraint
      const disabledEmail = `${user._id.toString()}.disabled.${Date.now()}@disabled.local`;
      user.email = disabledEmail;
    }
    user.isApproved = false;
    await user.save();
    return res.json({ message: 'User unapproved (account disabled). Email freed for new registration.' });
  } else {
    // Re-approve account; attempt to restore original email if available
    user.isApproved = true;
    if (user.previousEmail) {
      const desired = user.previousEmail;
      const exists = await User.findOne({ email: desired });
      if (!exists) {
        user.email = desired;
        user.previousEmail = undefined;
      }
    }
    await user.save();
    return res.json({ message: 'User approved' });
  }
};

// Analytics: most sold breed and most viewed categories
exports.analytics = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    // Most sold breed: count sold products grouped by breed
    const mostSoldBreedAgg = await Product.aggregate([
      { $match: { isSold: true, breed: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { _id: '$breed', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Most viewed categories: sum viewCount grouped by category
    const mostViewedCategoriesAgg = await Product.aggregate([
      { $match: { category: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { _id: '$category', totalViews: { $sum: { $ifNull: ['$viewCount', 0] } } } },
      { $sort: { totalViews: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      mostSoldBreed: mostSoldBreedAgg.map((x) => ({ breed: x._id, count: x.count })),
      mostViewedCategories: mostViewedCategoriesAgg.map((x) => ({ category: x._id, totalViews: x.totalViews })),
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { userId } = req.params;
  if (req.user._id.toString() === userId) {
    return res.status(400).json({ message: "You can't delete yourself" });
  }

  try {
    await User.findByIdAndDelete(userId);
    await Product.deleteMany({ sellerId: userId }); // optional: delete user's products too
    res.json({ message: 'User and their products deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { productId } = req.params;
  try {
    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: add a new product/pet, optionally for a given sellerId
exports.adminAddProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const { name, description, amount, category, sellerId } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    if (!name || !amount) return res.status(400).json({ message: 'Name and amount are required' });

    const owner = sellerId ? await User.findById(sellerId) : req.user;
    if (!owner) return res.status(400).json({ message: 'Invalid sellerId' });

    const product = new Product({
      sellerId: owner._id,
      name,
      description,
      amount,
      category: category || 'General',
      imageUrl,
    });
    await product.save();
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
};
