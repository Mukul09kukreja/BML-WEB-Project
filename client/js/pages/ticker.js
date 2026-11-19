// Ticker: browser page behavior and helpers.
(async function () {
  await API.ready;
  const viewport = document.getElementById('ticker'), pause = document.getElementById('tickerPause');
  if (!viewport || !pause) return;
  let paused = false;
  // Draw the current data in the page.
  function render() {
    if (paused) return;
    // Keep the animated element so quote updates do not restart its progress.
    if (!viewport.querySelector('.ticker-track')) viewport.innerHTML = '<div class="ticker-track"></div>';
    const track = viewport.querySelector('.ticker-track');
    track.innerHTML = [0, 1].map(copy => `<div class="ticker-group" ${copy ? 'aria-hidden="true"' : ''}>` + API.market.assets.slice(0, 8).map(a => `<div class="tick"><div><span>${a.symbol} · ${a.source}${a.stale ? ' · stale' : ''} · ${UI.quoteTime(a.timestamp)}</span><strong>${UI.money(a.price)}</strong><em class="${UI.trendClass(a.changePct)}">${a.price === null ? '—' : UI.signedPct(a.changePct)}</em></div></div>`).join('') + '</div>').join('');
  }
  pause.addEventListener('click', () => { paused = !paused; viewport.querySelector('.ticker-track')?.style.setProperty('animation-play-state', paused ? 'paused' : 'running'); pause.textContent = paused ? 'Resume ticker' : 'Pause ticker'; pause.setAttribute('aria-pressed', String(paused)); if (!paused) render(); });
  window.addEventListener('market:update', render); render();
})();
