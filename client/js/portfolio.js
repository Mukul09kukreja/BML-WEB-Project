// This page reads a fixed demonstration portfolio, not account-specific trades.
(function () {
  const user = Store.user();
  if (!user) return;
  document.getElementById('welcomeName').textContent = user.email.split('@')[0];
  document.getElementById('holdingsBody').innerHTML = STOCKPIE.portfolio.positions.map(function (item) {
    const gain = (item.price / item.averageCost - 1) * 100;
    return `<tr><td>${item.name} <span class="holding-symbol">${item.symbol}</span></td><td>${item.shares}</td>
      <td>${UI.money(item.averageCost)}</td><td>${UI.money(item.price)}</td><td>${UI.money(item.price * item.shares)}</td>
      <td class="${UI.trendClass(gain)}">${UI.signedPct(gain)}</td></tr>`;
  }).join('');
  const saved = Store.watchlist();
  const selected = STOCKPIE.assets.filter(function (asset) { return saved.includes(asset.symbol); });
  document.getElementById('watchlistCount').textContent = '(' + selected.length + ')';
  document.getElementById('watchlistPanel').innerHTML = selected.length ? selected.map(function (asset) {
    return `<div class="panel-row"><a href="markets.html?q=${encodeURIComponent(asset.symbol)}">${asset.symbol}</a><b>${UI.price(asset.price, asset.decimals)}</b></div>`;
  }).join('') : '<p class="tiny-note">No saved assets yet. Star an asset on Markets.</p>';

  const changes = { '1W': 0.86, '1M': 3.42, '3M': 7.15, '1Y': 12.84, All: STOCKPIE.portfolio.returnPct };
  const buttons = document.querySelectorAll('#portfolioRanges button');
  function showRange(range) {
    UI.plot(document.getElementById('portfolioChart'), STOCKPIE.charts[range]);
    document.getElementById('portfolioValue').textContent = UI.money(STOCKPIE.portfolio.value);
    document.getElementById('portfolioChange').textContent = UI.signedPct(changes[range]);
    buttons.forEach(function (button) {
      const selected = button.textContent.trim() === range;
      button.classList.toggle('on', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  buttons.forEach(function (button) { button.addEventListener('click', function () { showRange(button.textContent.trim()); }); });
  showRange('1Y');
  const dialog = document.getElementById('rebalanceDialog');
  UI.bindDialog(dialog);
  document.getElementById('rebalanceTrigger').addEventListener('click', function () { UI.openDialog(dialog); });
})();
