const User = require('../models/User');
const BannedEmail = require('../models/BannedEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email).toLowerCase().trim();
    if (await BannedEmail.findOne({ email: normalizedEmail })) {
      return res.status(403).json({ message: 'This email is banned from registering.' });
    }
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email: normalizedEmail, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
  if (user.isBlocked) return res.status(403).json({ message: 'Your account is blocked. Contact support.' });
  if (user.role !== 'admin' && user.isApproved === false) return res.status(403).json({ message: 'Your account is disabled (not approved). You can register a new account using your email.' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, isBlocked: user.isBlocked, isApproved: user.isApproved } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
