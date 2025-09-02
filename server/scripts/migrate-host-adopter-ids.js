// Backfill hostId/adopterId fields from legacy sellerId/customerId and mirror vice versa
// Usage: node server/scripts/migrate-host-adopter-ids.js

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/pawpal';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  let updatedProducts = 0;
  const products = await Product.find({});
  for (const p of products) {
    let changed = false;
    if (p.sellerId && !p.hostId) { p.hostId = p.sellerId; changed = true; }
    if (p.hostId && !p.sellerId) { p.sellerId = p.hostId; changed = true; }
    if (p.buyerId && !p.adopterId) { p.adopterId = p.buyerId; changed = true; }
    if (p.adopterId && !p.buyerId) { p.buyerId = p.adopterId; changed = true; }
    if (changed) { await p.save(); updatedProducts++; }
  }
  console.log(`Products updated: ${updatedProducts}/${products.length}`);

  let updatedOrders = 0;
  const orders = await Order.find({});
  for (const o of orders) {
    let changed = false;
    if (o.customerId && !o.adopterId) { o.adopterId = o.customerId; changed = true; }
    if (o.adopterId && !o.customerId) { o.customerId = o.adopterId; changed = true; }
    if (Array.isArray(o.items)) {
      for (const it of o.items) {
        if (it.sellerId && !it.hostId) { it.hostId = it.sellerId; changed = true; }
        if (it.hostId && !it.sellerId) { it.sellerId = it.hostId; changed = true; }
      }
    }
    if (changed) { await o.save(); updatedOrders++; }
  }
  console.log(`Orders updated: ${updatedOrders}/${orders.length}`);

  await mongoose.disconnect();
  console.log('Done');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
