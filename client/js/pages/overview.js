// Overview: browser page behavior and helpers.
(async function () {
  await API.ready;
  // Draw the current data in the page.
  function render() {
    const assets = API.market.assets || [];
    document.getElementById('indexGrid').innerHTML = assets.slice(0, 6).map(asset => `<div class="index-card"><span class="tiny-label">${asset.symbol} · ${asset.name}</span><strong class="index-value">${UI.money(asset.price)}</strong><em class="${UI.trendClass(asset.changePct)}">${asset.changePct === null ? 'Daily change unavailable' : UI.signedPct(asset.changePct)}${asset.stale ? ' · stale' : ''}</em><span class="tiny-note">${UI.quoteTime(asset.timestamp)}</span></div>`).join('');
    document.getElementById('moverPanel').innerHTML = [...assets].filter(asset => asset.price !== null && asset.changePct !== null).sort((a, b) => Math.abs(b.changePct || 0) - Math.abs(a.changePct || 0)).slice(0, 6).map(asset => `<div class="panel-row"><span>${asset.symbol}</span><b>${UI.signedPct(asset.changePct || 0)}</b></div>`).join('') || '<p class="tiny-note">No daily changes are available.</p>';
    document.getElementById('feedNote').textContent = API.market.status;
  }
  window.addEventListener('market:update', render);
  render();
})();
