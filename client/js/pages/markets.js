// Markets: browser page behavior and helpers.
(async function () {
  await API.ready;
  const body = document.getElementById('marketBody');
  const search = document.getElementById('marketSearch');
  const headings = document.querySelectorAll('th[data-sort]');
  let sort = 'name', direction = 1;
  search.value = new URLSearchParams(location.search).get('q') || '';

  // Draw the current data in the page.
  function render() {
    const query = search.value.trim().toLowerCase();
    const assets = API.market.assets || [];
    const rows = assets.filter(asset => (asset.name + asset.symbol).toLowerCase().includes(query));
    rows.sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : (a[sort] || 0) - (b[sort] || 0)) * direction);
    body.innerHTML = rows.map(asset => `<tr><td><span class="asset-name">${asset.name}</span></td><td><a href="portfolio.html?symbol=${asset.symbol}">${asset.symbol}</a></td><td>${UI.money(asset.price)}${asset.stale ? ' *' : ''}</td><td class="${UI.trendClass(asset.changePct)}">${asset.changePct === null ? '—' : UI.signedPct(asset.changePct)}</td><td>${UI.quoteTime(asset.timestamp)}</td></tr>`).join('') || `<tr><td colspan="5">${assets.length ? 'No supported stocks match your search.' : 'Market data is unavailable. Waiting for the feed to recover.'}</td></tr>`;
    document.getElementById('marketCount').textContent = `${rows.length} NSE stocks · INR · * last quote is stale`;
    headings.forEach(heading => {
      const selected = heading.dataset.sort === sort;
      heading.setAttribute('aria-sort', selected ? (direction === 1 ? 'ascending' : 'descending') : 'none');
      heading.querySelector('.sort-arrow').textContent = selected ? (direction === 1 ? '▲' : '▼') : '↕';
    });
  }

  search.addEventListener('input', render);
  headings.forEach(heading => {
    heading.tabIndex = 0;
    const change = () => { direction = sort === heading.dataset.sort ? -direction : 1; sort = heading.dataset.sort; render(); };
    heading.addEventListener('click', change);
    heading.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); change(); } });
  });
  document.getElementById('resetMarkets').addEventListener('click', () => { sort = 'name'; direction = 1; search.value = ''; render(); });
  window.addEventListener('market:update', render);
  render();
})();
