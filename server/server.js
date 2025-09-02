// Load environment variables
require('dotenv').config();

// Core dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');
const donationRoutes = require('./routes/donationRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Models
const User = require('./models/User');

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes middleware
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/donations', donationRoutes);

// Utils: safe logging for secrets
const maskMongoUri = (uri) => {
  if (!uri) return 'undefined';
  try {
    // URL supports custom protocols; this will work for mongodb+srv
    const u = new URL(uri);
    const auth = u.username ? `${u.username}:${u.password ? '***' : ''}@` : '';
    return `${u.protocol}//${auth}${u.host}${u.pathname}`;
  } catch (_) {
    // Fallback masking
    return uri.replace(/:\/\/.*@/, '://***@');
  }
};

// Utils: sanitize a MongoDB URI by trimming quotes, removing placeholder angle brackets
// around credentials, and URL-encoding username/password to handle special characters
const sanitizeMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return uri;
  // Trim surrounding quotes/spaces
  let raw = uri.trim().replace(/^['"]|['"]$/g, '');
  try {
    const u = new URL(raw);
    // Clean up username/password
    const clean = (v) => {
      if (v == null) return v;
      // Remove common placeholder wrappers like <...>
      let s = String(v).replace(/^<+|>+$/g, '');
      // Avoid double-encoding: first decode if encoded, then encode
      try { s = decodeURIComponent(s); } catch (_) { /* ignore */ }
      return encodeURIComponent(s);
    };
    if (u.username) u.username = clean(u.username);
    if (u.password) u.password = clean(u.password);
    // Preserve original search/hash
    const out = `${u.protocol}//${u.username}${u.password ? ':' + u.password : ''}@${u.host}${u.pathname}${u.search}${u.hash}`;
    return out;
  } catch (_) {
    // If it cannot be parsed by URL (e.g., very malformed), return the raw trimmed value
    return raw;
  }
};

// DEBUG: Show a masked version of the Mongo URI
console.log('ℹ️ MONGODB_URI (masked):', maskMongoUri(sanitizeMongoUri(process.env.MONGODB_URI)));

// Auto-create or update predefined admin user by email
const createAdminIfNotExists = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const rawPassword = process.env.ADMIN_PASSWORD;

    if (!email || !rawPassword) {
      console.warn('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env; skipping admin bootstrap');
      return;
    }

    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    if (!user) {
      user = new User({
        name: 'Admin',
        email,
        password: hashedPassword,
        role: 'admin',
      });
      await user.save();
      console.log(`✅ Admin user created: ${email}`);
      return;
    }

    // Ensure user has admin role and the password from .env
    let changed = false;
    if (user.role !== 'admin') {
      user.role = 'admin';
      changed = true;
    }
    // Always reset to the configured password to guarantee known credentials
    user.password = hashedPassword;
    changed = true;

    if (changed) {
      await user.save();
      console.log(`✅ Admin user ensured/updated: ${email}`);
    } else {
      console.log('ℹ️ Admin user already up to date');
    }
  } catch (err) {
    console.error('❌ Failed to ensure admin user:', err);
  }
};

// Robust connect with retry to avoid immediate process exit
let serverStarted = false;
let attempt = 0;
const MAX_DELAY_MS = 30000; // cap backoff at 30s

const startHttpServer = () => {
  if (serverStarted) return;
  serverStarted = true;
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

const connectWithRetry = () => {
  const uri = sanitizeMongoUri(process.env.MONGODB_URI);
  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Add it to your server/.env file.');
    const delay = 5000;
    console.log(`⏳ Retrying Mongo connection in ${delay / 1000}s...`);
    setTimeout(connectWithRetry, delay);
    return;
  }
  // If raw env had placeholders, we already stripped them, but still warn once for visibility
  if (/[<>]/.test(process.env.MONGODB_URI || '')) {
    console.warn('⚠️ Detected < or > in original MONGODB_URI. Placeholders were removed and credentials URL-encoded for connection. Consider fixing .env.');
  }

  attempt += 1;
  console.log(`🔌 Connecting to MongoDB (attempt ${attempt})...`);
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // You can set dbName in URI or here via options
    })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      // Ensure admin after DB connection
      createAdminIfNotExists();
      // Start HTTP server once DB is ready
      startHttpServer();
    })
    .catch((err) => {
      const details = [
        err && err.message ? err.message : String(err),
        err && typeof err.code !== 'undefined' ? `(code: ${err.code})` : '',
        err && err.codeName ? `(codeName: ${err.codeName})` : '',
      ]
        .filter(Boolean)
        .join(' ');
      console.error('❌ MongoDB connection error:', details);
      const backoff = Math.min(1000 * Math.pow(2, Math.min(attempt - 1, 5)), MAX_DELAY_MS); // 1s,2s,4s,8s,16s,32s cap 30s
      console.log(`⏳ Retrying in ${Math.round(backoff / 1000)}s...`);
      setTimeout(connectWithRetry, backoff);
    });
};

connectWithRetry();

// Basic global error handlers to avoid silent exits
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
});
