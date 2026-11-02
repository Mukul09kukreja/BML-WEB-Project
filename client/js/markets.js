// Change state, then call render(): filter -> sort -> display table rows.
(function () {
  const body = document.getElementById('marketBody');
  const search = document.getElementById('marketSearch');
  const chips = document.querySelectorAll('.chips .chip');
  const headings = document.querySelectorAll('th[data-sort]');
  const params = new URLSearchParams(location.search);
  let category = params.get('type') || 'all';
  let sortKey = 'name';
  let direction = 1;
  search.value = params.get('q') || '';

  function render() {
    const query = search.value.trim().toLowerCase();
    const rows = STOCKPIE.assets.filter(function (asset) {
      const matchesCategory = category === 'all' || asset.type === category;
      const matchesSearch = (asset.name + ' ' + asset.symbol).toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
    rows.sort(function (a, b) {
      if (sortKey === 'name') return a.name.localeCompare(b.name) * direction;
      return ((a[sortKey] || 0) - (b[sortKey] || 0)) * direction;
    });
    const saved = Store.watchlist();
    body.innerHTML = rows.map(function (asset) {
      const starred = saved.includes(asset.symbol);
      return `<tr><td><span class="asset-name">${asset.name}</span>
        <button type="button" class="star ${starred ? 'on' : ''}" data-star="${asset.symbol}"
          aria-pressed="${starred}" aria-label="${starred ? 'Remove' : 'Add'} ${asset.symbol} ${starred ? 'from' : 'to'} watchlist">${starred ? '★' : '☆'}</button></td>
        <td>${asset.symbol}</td><td>${UI.price(asset.price, asset.decimals)}</td>
        <td class="${UI.trendClass(asset.changePct)}">${UI.signedPct(asset.changePct)}</td>
        <td>${asset.marketSize || '-'}</td><td>${asset.volume === null ? '-' : UI.number(asset.volume)}</td></tr>`;
    }).join('');
    if (!rows.length) body.innerHTML = '<tr class="empty-row"><td colspan="6">No assets match. Clear the search or choose All markets.</td></tr>';
    document.getElementById('marketCount').textContent = `Showing ${rows.length} of ${STOCKPIE.assets.length} assets`;
    chips.forEach(function (chip) {
      const selected = chip.dataset.filter === category;
      chip.classList.toggle('on', selected);
      chip.setAttribute('aria-pressed', String(selected));
    });
    headings.forEach(function (heading) {
      const selected = heading.dataset.sort === sortKey;
      heading.setAttribute('aria-sort', selected ? (direction === 1 ? 'ascending' : 'descending') : 'none');
      heading.querySelector('.sort-arrow').textContent = selected ? (direction === 1 ? '▲' : '▼') : '';
    });
    // Rows are new after rendering, so attach listeners to their new star buttons.
    body.querySelectorAll('[data-star]').forEach(function (button) {
      button.addEventListener('click', function () { Store.toggleWatchlist(button.dataset.star); render(); });
    });
  }
  search.addEventListener('input', render);
  chips.forEach(function (chip) { chip.addEventListener('click', function () { category = chip.dataset.filter; render(); }); });
  headings.forEach(function (heading) {
    heading.tabIndex = 0;
    heading.addEventListener('click', function () {
      direction = sortKey === heading.dataset.sort ? -direction : 1;
      sortKey = heading.dataset.sort;
      render();
    });
    heading.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); heading.click(); }
    });
  });
  render();
})();
