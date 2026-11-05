// Display a few items from the shared catalog. Only trusted catalog text becomes HTML.
(function () {
  // map builds one HTML block per index; join combines the blocks for display.
  document.getElementById('ticker').innerHTML = STOCKPIE.ticker.map(function (index) {
    return `<div class="tick"><div><span>${index.name}</span><strong>${UI.number(index.value)}</strong>
      <em class="${UI.trendClass(index.changePct)}">${UI.signedPct(index.changePct)}</em></div></div>`;
  }).join('');
  // Show the first three articles. Their index in the link opens the matching news popup.
  document.getElementById('homeInsights').innerHTML = STOCKPIE.news.slice(0, 3).map(function (item, index) {
    return `<article class="insight"><div class="insight-img ${item.imageClass}"><span class="tag">${item.category}</span></div>
      <p class="tiny-note">Demonstration article · ${item.date}</p><h3>${item.title}</h3><p class="muted-sm">${item.excerpt}</p>
      <a href="market-news.html?article=${index}" class="link-small">Read insight &rarr;</a></article>`;
  }).join('');
})();
