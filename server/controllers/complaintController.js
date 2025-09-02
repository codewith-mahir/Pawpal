const Complaint = require('../models/Complaint');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.submitComplaint = async (req, res) => {
  try {
  const { message, productId, orderId } = req.body;
    // Only sellers and customers can submit complaints (no admins)
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot submit complaints.' });
    }
    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }
    // Validate optional IDs to avoid CastError 500s
    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }
    if (orderId && !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid orderId' });
    }

    const proofUrl = req.file ? String(req.file.path).replace(/\\/g, '/') : undefined;
    const trimmed = String(message).trim();
    const complaint = new Complaint({
      userId: req.user._id,
      message: trimmed,
      productId: productId || undefined,
      orderId: orderId || undefined,
      proofUrl,
    });
    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted' });
  } catch (err) {
    // Map common Mongoose errors to 400 with clear messages
    if (err && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return res.status(400).json({ message: err.message });
    }
    console.error('submitComplaint error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .populate('productId', 'name')
      .populate('orderId', '_id status');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { id } = req.params;
    const { status, adminReply } = req.body;
    const c = await Complaint.findById(id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    if (status) {
      c.status = status;
      if (status === 'resolved') c.resolvedAt = new Date();
    }
    if (adminReply !== undefined) c.adminReply = adminReply;
    await c.save();
    res.json({ message: 'Complaint updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
