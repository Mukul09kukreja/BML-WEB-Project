// Cards are created from arrays. Range buttons select a fixed sample chart array.
(function () {
  document.getElementById('indexGrid').innerHTML = STOCKPIE.indices.map(function (index) {
    const value = index.format === 'usd' ? UI.money(index.value) : UI.number(index.value);
    return `<div class="index-card"><span class="tiny-label">${index.name}</span><strong class="index-value">${value}</strong>
      <em class="${UI.trendClass(index.changePct)}">${UI.signedPct(index.changePct)} today</em></div>`;
  }).join('');
  document.getElementById('sectorPanel').innerHTML = STOCKPIE.sectors.map(function (item) {
    return `<div class="panel-row"><span>${item.label}</span><b class="${UI.trendClass(item.changePct)}">${UI.signedPct(item.changePct)}</b></div>`;
  }).join('');
  document.getElementById('moverPanel').innerHTML = STOCKPIE.movers.map(function (item) {
    return `<div class="panel-row"><span>${item.symbol}</span><b class="${UI.trendClass(item.changePct)}">${UI.signedPct(item.changePct)}</b></div>`;
  }).join('');
  document.getElementById('macroPanel').innerHTML = STOCKPIE.macro.map(function (item) {
    return `<div class="panel-row"><span>${item.label}</span><b>${item.value}</b></div>`;
  }).join('');
  const changes = { '1D': 12.4, '1W': 28.15, '1M': 62.4, '3M': 118.2, '1Y': 421.3, '5Y': 1892.1 };
  const buttons = document.querySelectorAll('#overviewRanges button');
  function showRange(range) {
    UI.plot(document.getElementById('overviewChart'), STOCKPIE.charts[range]);
    document.getElementById('chartChange').textContent = '+' + changes[range].toFixed(2);
    buttons.forEach(function (button) {
      const selected = button.textContent.trim() === range;
      button.classList.toggle('on', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  buttons.forEach(function (button) { button.addEventListener('click', function () { showRange(button.textContent.trim()); }); });
  showRange('1Y');
})();
