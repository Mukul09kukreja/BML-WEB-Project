// Validate portfolio requests and save trades with concurrency protection.
// Portfolio: server logic and supporting functions.
const User = require('../models/user');
const catalog = require('../data/stocks');
const { trade } = require('../services/trading');

const fail = (message, status = 400) => Object.assign(new Error(message), { status });

// Existing portfolio request handlers. Each function receives an Express request and response.
module.exports = function (market) {
  return {
    // Calculate the signed-in account’s holdings and totals.
    getPortfolio: (req, res) => {
      res.json(calculatePortfolio(req.user, market));
    },
    // Validate the request, apply the trade, and retry concurrent database changes.
    placeTrade: async (req, res) => {
      const side = req.params.side;
      if (!['buy', 'sell'].includes(side)) throw fail('API route not found.', 404);
      const { symbol, quantity } = req.body || {};
      const id = req.get('Idempotency-Key');
      if (!id || !/^[a-zA-Z0-9-]{16,80}$/.test(id)) throw fail('Send a valid Idempotency-Key header.');
      const asset = catalog.find(item => item.symbol === symbol);
      if (!asset) throw fail('Choose a supported NSE stock.');
      if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100000) throw fail('Quantity must be a whole number between 1 and 100,000.');
      for (let attempt = 0; attempt < 3; attempt++) {
        const user = attempt ? await User.findById(req.session.userId) : req.user;
        if (!user) throw fail('Sign in again.', 401);
        const previous = user.trades.find(order => order.id === id);
        const quote = market.list().find(item => item.symbol === symbol);
        if (!previous && (!quote?.price || quote.stale)) throw fail('A recent market price is unavailable. Trading is paused.', 503);
        const order = trade(user, { id, side, symbol, quantity }, asset, previous?.price ?? quote.price);
        try {
          if (!previous) await user.save();
          return res.status(previous ? 200 : 201).json({ message: `${side === 'buy' ? 'Bought' : 'Sold'} ${quantity} ${symbol} share(s) at ₹${order.price.toFixed(2)}.`, order });
        } catch (error) {
          if (error.name !== 'VersionError') throw error;
        }
      }
      throw fail('Your portfolio changed during this trade. Please retry.', 409);
    }
  };
};
