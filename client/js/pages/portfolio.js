// Display portfolio values and submit trades while retaining uncertain request IDs.
(async function () {
  await API.ready;
  const requested = new URLSearchParams(location.search).get('symbol') || '';
  if (!API.user) {
    document.getElementById('portfolioSignIn').href = 'sign-in.html' + (requested ? '?symbol=' + encodeURIComponent(requested) : '');
    return;
  }
  document.getElementById('welcomeName').textContent = API.user.username;
  const form = document.getElementById('tradeForm');
  const select = document.getElementById('stockSymbol');
  const quantity = document.getElementById('stockQuantity');
  const side = document.getElementById('tradeSide');
  const status = document.getElementById('tradeStatus');
  const button = document.getElementById('tradeSubmit');
  let portfolio, busy = false, pending = null;
  let refreshNumber = 0;

  // Update the displayed estimate and enable only valid form actions.
  function estimate() {
    const asset = API.market.assets.find(item => item.symbol === select.value);
    const count = Number(quantity.value);
    const owned = portfolio?.positions.find(item => item.symbol === select.value)?.quantity || 0;
    const valid = Number.isSafeInteger(count) && count > 0 && count <= 100000;
    const costInPaise = Math.round((asset?.price || 0) * 100) * count;
    const cashInPaise = Math.round((portfolio?.cash || 0) * 100);
    const affordable = side.value === 'buy' ? costInPaise <= cashInPaise : count <= owned;
    document.getElementById('tradeEstimate').textContent = asset?.price
      ? `${side.value === 'buy' ? 'Cost' : 'Proceeds'}: ${UI.money(costInPaise / 100)} · ${UI.quoteTime(asset.timestamp)}${asset.stale ? ' · stale: trading paused' : ''} · Owned: ${owned}`
      : 'Price unavailable. Waiting for the market feed.';
    if (busy) button.textContent = 'Submitting…';
    else if (pending) button.textContent = 'Retry pending trade';
    else button.textContent = side.value === 'buy' ? 'Buy shares' : 'Sell shares';
    button.disabled = busy || !portfolio || (!pending && (!valid || !affordable || !asset?.price || asset.stale));
    [select, quantity, side].forEach(input => { input.disabled = busy || Boolean(pending); });
    document.getElementById('pendingNote').hidden = !pending;
  }

  // Draw the current data in the page.
  function render() {
    if (!portfolio) return;
    for (const [id, key] of Object.entries({ portfolioValue: 'total', cashValue: 'cash', investedValue: 'invested', gainValue: 'gain', realizedValue: 'realized' })) {
      document.getElementById(id).textContent = UI.money(portfolio[key]);
    }
    document.getElementById('portfolioStatus').textContent = API.market.status;
    document.getElementById('holdingsBody').innerHTML = portfolio.positions.map(p => `<tr><td>${p.name} (${p.symbol})</td><td>${p.quantity}</td><td>${UI.money(p.averageBuyPrice)}</td><td>${UI.money(p.price)}${p.stale ? ' · stale' : ''}<br><small>${UI.quoteTime(p.timestamp)}</small></td><td>${UI.money(p.value)}</td><td class="${UI.trendClass(p.gain)}">${UI.money(p.gain)}</td></tr>`).join('') || '<tr><td colspan="6">No holdings yet.</td></tr>';
    document.getElementById('tradeBody').innerHTML = portfolio.trades.map(t => `<tr><td>${UI.quoteTime(t.date)}</td><td>${t.side === 'buy' ? 'Buy' : 'Sell'}</td><td>${t.symbol}</td><td>${t.quantity}</td><td>${UI.money(t.price)}</td><td>${UI.money(t.realized)}</td></tr>`).join('') || '<tr><td colspan="6">No trades yet.</td></tr>';
    estimate();
  }

  // Request the latest portfolio and display any request error.
  async function refresh() {
    const requestNumber = ++refreshNumber;
    try {
      const latest = await API.request('/api/portfolio');
      // Only the newest request may change the page, even if older requests finish later.
      if (requestNumber !== refreshNumber) return;
      portfolio = latest;
      render();
    } catch (error) {
      if (requestNumber !== refreshNumber) return;
      document.getElementById('portfolioStatus').textContent = error.message;
      estimate();
    }
  }

  // Rebuild stock options while retaining the selected stock.
  function updateStocks() {
    const selected = pending?.symbol || select.value || requested;
    select.replaceChildren(...API.market.assets.map(asset => new Option(`${asset.symbol} · ${asset.name}${!asset.price ? ' · Price unavailable' : ''}`, asset.symbol)));
    if ([...select.options].some(option => option.value === selected)) select.value = selected;
    estimate();
  }
  [select, quantity, side].forEach(input => input.addEventListener('input', estimate));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    pending ||= { id: crypto.randomUUID(), side: side.value, symbol: select.value, quantity: Number(quantity.value) };
    try { sessionStorage.setItem('stockpie.pending.' + API.user.id, JSON.stringify(pending)); } catch { /* Keep the request ID in memory. */ }
    busy = true;
    estimate();
    try {
      const result = await API.request('/api/portfolio/' + pending.side, 'POST', pending, { 'Idempotency-Key': pending.id });
      // An incomplete response cannot confirm that this particular trade was saved.
      if (result.order?.id !== pending.id || typeof result.message !== 'string') {
        throw new Error('Trade confirmation was incomplete. Retry the pending trade.');
      }
      status.textContent = result.message;
      pending = null;
      try { sessionStorage.removeItem('stockpie.pending.' + API.user.id); } catch { /* Storage may be disabled. */ }
      await refresh();
    } catch (error) {
      status.textContent = error.message;
      // A lost response may follow a committed trade: retain its ID until a definite response.
      if (error.status && error.status < 500) {
        pending = null;
        try { sessionStorage.removeItem('stockpie.pending.' + API.user.id); } catch { /* Storage may be disabled. */ }
      }
    } finally { busy = false; estimate(); }
  });
  try { pending = JSON.parse(sessionStorage.getItem('stockpie.pending.' + API.user.id)); } catch { /* No pending trade. */ }
  if (pending) { side.value = pending.side; quantity.value = pending.quantity; }
  updateStocks();
  await refresh();
  window.addEventListener('market:update', () => { updateStocks(); refresh(); });
})();
