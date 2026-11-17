// Home: browser page behavior and helpers.
// Display a few items from the shared catalog. Only trusted catalog text becomes HTML.
(function () {
  document.getElementById('homeInsights').innerHTML = STOCKPIE.news.slice(0, 3).map(function (item, index) {
    return `<article class="insight"><div class="insight-img ${item.imageClass}"><span class="tag">${item.category}</span></div>
      <p class="tiny-note">Demonstration article · ${item.date}</p><h3>${item.title}</h3><p class="muted-sm">${item.excerpt}</p>
      <a href="market-news.html?article=${index}" class="link-small">Read insight &rarr;</a></article>`;
  }).join('');
})();
