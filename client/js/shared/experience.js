// Experience: browser page behavior and helpers.
(function () {
  'use strict';
  const page = document.body.dataset.page;
  const main = document.querySelector('main') || document.querySelector('.hero');
  if (main) {
    if (!main.id) main.id = 'mainContent';
    main.setAttribute('tabindex', '-1');
    const skip = document.createElement('a'); skip.className = 'skip-link'; skip.href = '#' + main.id; skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }
  // Let keyboard users reach and scroll wide tables, with a hint only when needed.
  const tables = Array.from(document.querySelectorAll('.table-scroll'));
  tables.forEach(function (table) {
    table.tabIndex = 0; table.setAttribute('role', 'region');
    const heading = table.closest('section, .table-card')?.querySelector('h2, h3');
    table.setAttribute('aria-label', (heading ? heading.textContent : 'Data table') + '. Scroll horizontally for more columns.');
    const hint = document.createElement('p'); hint.className = 'table-scroll-hint'; hint.textContent = 'Swipe or scroll sideways to see all columns →'; table.before(hint);
    const update = function () { hint.hidden = table.scrollWidth <= table.clientWidth; };
    update();
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(table);
    else window.addEventListener('resize', update);
  });
  const banners = {
    markets: ['architecture.jpg', 'A world of possibility.', 'Explore NSE stocks with Yahoo Finance prices.'],
    'market-overview': ['city.jpg', 'Find perspective in the bigger picture.', 'NSE prices from Yahoo Finance'],
    about: ['architecture.jpg', 'Start curious. Stay consistent.', 'An independent student project, built for learning.'],
    portfolio: ['architecture.jpg', 'Every holding tells part of the story.', 'Practice trading NSE stocks and track your virtual portfolio.']
  };
  if (banners[page]) {
    const [photo, title, description] = banners[page];
    const figure = document.createElement('figure');
    figure.className = 'photo-banner';
    figure.innerHTML = '<img src="assets/' + photo + '" alt="" width="1200" height="500"><figcaption><strong>' + title + '</strong><span>' + description + '</span></figcaption><div class="flow-lines" aria-hidden="true">' + '<i></i>'.repeat(9) + '</div>';
    // Portfolio banner stays outside the account-gated content and contains no account data.
    if (page === 'portfolio') document.querySelector('main').prepend(figure);
    else document.querySelector('.page-sub').after(figure);
  }

  if (page === 'market-news') {
    const cards = Array.from(document.querySelectorAll('.news-card'));
    const images = ['city.jpg', 'architecture.jpg', 'research.jpg'];
    cards.forEach(function (card, i) {
      const img = document.createElement('img');
      img.src = 'assets/' + images[i % images.length];
      img.alt = ''; img.loading = 'lazy'; img.width = 900; img.height = 600;
      card.querySelector('.news-img').prepend(img);
    });
    const filters = document.createElement('div');
    filters.className = 'journal-filters'; filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', 'Filter articles by topic');
    const count = document.createElement('p'); count.className = 'journal-count'; count.setAttribute('role', 'status');
    ['All topics', ...new Set(STOCKPIE.news.map(item => item.category))].forEach(function (topic) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'chip'; button.textContent = topic;
      button.setAttribute('aria-pressed', String(topic === 'All topics'));
      if (topic === 'All topics') button.classList.add('on');
      button.addEventListener('click', function () {
        let visible = 0;
        cards.forEach(function (card, i) { card.hidden = topic !== 'All topics' && STOCKPIE.news[i].category !== topic; if (!card.hidden) visible++; });
        filters.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b === button); b.setAttribute('aria-pressed', String(b === button)); });
        count.textContent = visible + (visible === 1 ? ' sample article' : ' sample articles');
      });
      filters.append(button);
    });
    count.textContent = cards.length + ' sample articles';
    document.getElementById('newsGrid').before(filters, count);
  }

  if (page === 'about') {
    const explorer = document.createElement('section'); explorer.className = 'strategy-explorer'; explorer.setAttribute('aria-label', 'Explore sample strategy allocations');
    explorer.innerHTML = '<div class="allocation-ring" aria-hidden="true"></div><div><p class="tiny-label">Try a different balance</p><div class="chips" role="group" aria-label="Sample strategy"></div><p class="allocation-description" role="status"></p><div class="allocation-key"><span>Equities</span><span>Bonds</span><span>Gold / cash</span></div></div>';
    const choices = [ ['Conservative',35,55,10], ['Balanced',60,30,10], ['Growth',85,10,5] ];
    choices.forEach(function ([name,equity,bonds,cash]) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'chip'; button.textContent = name;
      button.addEventListener('click', function () {
        explorer.querySelector('.allocation-ring').style.background = `conic-gradient(#d4af37 0 ${equity}%, #7caa9b ${equity}% ${equity+bonds}%, #646d78 ${equity+bonds}% 100%)`;
        explorer.querySelector('.allocation-description').textContent = `${name}: ${equity}% equities, ${bonds}% bonds, ${cash}% gold / cash. Illustrative mix only; this does not change your portfolio.`;
        explorer.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b === button); b.setAttribute('aria-pressed', String(b === button)); });
      });
      explorer.querySelector('.chips').append(button);
    });
    document.querySelector('#strategies h2').after(explorer);
    explorer.querySelectorAll('button')[1].click();
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  try { paused = paused || localStorage.getItem('stockpie.motionPaused') === 'true'; } catch (_) { /* Storage can be disabled. */ }
  const toolbar = document.createElement('div'); toolbar.className = 'experience-toolbar';
  const motion = document.createElement('button'); motion.type = 'button';
  function updateMotion() {
    document.documentElement.classList.toggle('motion-paused', paused || reduced.matches);
    motion.textContent = reduced.matches ? 'Reduced motion enabled' : paused ? 'Resume motion' : 'Pause motion';
    motion.setAttribute('aria-pressed', String(paused || reduced.matches));
    motion.disabled = reduced.matches;
  }
  motion.addEventListener('click', function () { paused = !paused; updateMotion(); try { localStorage.setItem('stockpie.motionPaused', String(paused)); } catch (_) {} });
  reduced.addEventListener('change', updateMotion); updateMotion();
  const top = document.createElement('button'); top.type = 'button'; top.textContent = 'Back to top ↑';
  top.addEventListener('click', function () { window.scrollTo({top:0, behavior: paused || reduced.matches ? 'instant' : 'smooth'}); const heading = document.querySelector('h1'); if (heading) { heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); } });
  toolbar.append(motion, top); document.body.append(toolbar);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { if (!paused && !reduced.matches) entry.target.classList.add('visual-enter'); observer.unobserve(entry.target); } }); }, {threshold:.12});
    document.querySelectorAll('.photo-banner, .feature, .panel, .news-card, .strategy-explorer').forEach(element => observer.observe(element));
  }
})();
