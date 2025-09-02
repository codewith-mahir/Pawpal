const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });

  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'Invalid token user.' });
    if (req.user.isBlocked) return res.status(403).json({ message: 'Account blocked.' });
  if (req.user.role !== 'admin' && req.user.isApproved === false) {
      return res.status(403).json({ message: 'Account disabled (not approved).' });
    }
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};
