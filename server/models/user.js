// Define account credentials, virtual cash, holdings, and saved trades.
const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  buyPrice: { type: Number, required: true, min: 0 },
  boughtAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, sparse: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  holdings: { type: [holdingSchema], default: [] },
  cash: { type: Number, default: 100000000, min: 0 },
  realized: { type: Number, default: 0 },
  trades: { type: [{
    _id: false, id: String, side: String, symbol: String, quantity: Number,
    price: Number, realized: Number, date: Date
  }], default: [] }
}, { timestamps: true, optimisticConcurrency: true });

module.exports = mongoose.model('User', userSchema);
