// Combine purchase lots and calculate portfolio totals without changing stored records.
module.exports = function calculatePortfolio(user, market) {
  const prices = new Map(market.list().map(asset => [asset.symbol, asset]));
  const holdings = new Map();
  for (const lot of user.holdings) {
    const quote = prices.get(lot.symbol);
    const row = holdings.get(lot.symbol) || {
      symbol: lot.symbol, name: lot.name, quantity: 0, cost: 0,
      price: quote?.price ?? null, stale: quote?.stale ?? true,
      timestamp: quote?.timestamp ?? null
    };
    row.quantity += lot.quantity;
    row.cost += lot.quantity * lot.buyPrice;
    holdings.set(lot.symbol, row);
  }
  const positions = [...holdings.values()].map(row => ({
    ...row,
    averageBuyPrice: row.cost / row.quantity,
    value: row.price === null ? null : row.price * row.quantity,
    gain: row.price === null ? null : row.price * row.quantity - row.cost
  }));
  const invested = positions.reduce((sum, position) => sum + position.cost, 0);
  const complete = positions.every(position => position.value !== null);
  const value = complete ? positions.reduce((sum, position) => sum + position.value, 0) : null;
  return {
    username: user.username,
    cash: user.cash / 100,
    realized: user.realized / 100,
    invested, value,
    total: value === null ? null : value + user.cash / 100,
    gain: value === null ? null : value - invested,
    positions,
    tradeCount: user.trades.length,
    trades: user.trades.slice(-50).reverse()
  };
};
