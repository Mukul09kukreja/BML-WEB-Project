// Every Read more button fills the same native dialog; no popup library is needed.
(function () {
  const grid = document.getElementById('newsGrid');
  const dialog = document.getElementById('newsDialog');
  grid.innerHTML = STOCKPIE.news.map(function (item, index) {
    return `<article class="news-card"><div class="news-img ${item.imageClass}"><span class="tag">${item.category}</span></div>
      <p class="tiny-note">Demonstration · ${item.date}</p><h3>${item.title}</h3><p class="muted-sm">${item.excerpt}</p>
      <button type="button" class="link-small link-button" data-article="${index}">Read more &rarr;</button></article>`;
  }).join('');
  grid.querySelectorAll('[data-article]').forEach(function (button) {
    button.addEventListener('click', function () {
      const item = STOCKPIE.news[Number(button.dataset.article)];
      document.getElementById('newsDialogTitle').textContent = item.title;
      document.getElementById('newsDialogMeta').textContent = item.category + ' · ' + item.date;
      document.getElementById('newsDialogBody').innerHTML = item.body.map(function (paragraph) { return '<p>' + paragraph + '</p>'; }).join('');
      UI.openDialog(dialog);
    });
  });
  UI.bindDialog(dialog);
  // Home previews link directly to an article number; simulate its button click.
  const article = new URLSearchParams(location.search).get('article');
  if (article !== null && /^\d+$/.test(article)) {
    const button = grid.querySelector('[data-article="' + article + '"]');
    if (button) button.click();
  }
})();
