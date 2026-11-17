// Apply purchases and FIFO sales using integer paise for cash movements.
const cents = value => Math.round(value * 100);
const fail = message => Object.assign(new Error(message), { status: 400 });

// Cash and realized gains use paise. Holdings retain rupee prices for existing accounts.
function trade(user, { id, side, symbol, quantity }, asset, price) {
  const previous = user.trades.find(order => order.id === id);
  if (previous) {
    if (previous.side !== side || previous.symbol !== symbol || previous.quantity !== quantity) throw fail('This request ID was already used for another trade.');
    return previous;
  }
  // Keep the embedded history bounded without forgetting IDs used by earlier requests.
  if (user.trades.length >= 10000) throw fail('This demo account has reached its 10,000-trade limit.');
  const total = cents(price) * quantity;
  let profit = 0;
  if (side === 'buy') {
    if (user.cash < total) throw fail('Not enough virtual cash for this purchase.');
    user.cash -= total;
    user.holdings.push({ symbol, name: asset.name, quantity, buyPrice: cents(price) / 100, boughtAt: new Date() });
  } else {
    const owned = user.holdings.filter(lot => lot.symbol === symbol).reduce((sum, lot) => sum + lot.quantity, 0);
    if (owned < quantity) throw fail('You do not own enough shares to sell.');
    let remaining = quantity;
    // Sell oldest purchases first (FIFO), retaining the cost of unsold shares.
    for (const lot of user.holdings) {
      if (lot.symbol !== symbol || !remaining) continue;
      const sold = Math.min(remaining, lot.quantity);
      profit += (cents(price) - cents(lot.buyPrice)) * sold;
      lot.quantity -= sold;
      remaining -= sold;
    }
    user.holdings = user.holdings.filter(lot => lot.quantity > 0);
    user.cash += total;
    user.realized += profit;
  }
  const order = { id, side, symbol, quantity, price: cents(price) / 100, realized: profit / 100, date: new Date() };
  user.trades.push(order);
  return order;
}
module.exports = { trade };
