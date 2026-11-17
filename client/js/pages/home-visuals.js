// Home visuals: browser page behavior and helpers.
(function () {
  'use strict';
  const chart = document.getElementById('previewChart');
  const buttons = document.querySelectorAll('[data-preview-range]');
  // Draw the selected illustrative chart range.
  function selectRange(range) {
    const values = STOCKPIE.charts[range];
    if (!values) return;
    UI.plot(chart, values);
    const last = values[values.length - 1];
    document.getElementById('previewValue').textContent = last.toFixed(2);
    const change = document.getElementById('previewChange');
    const percent = (last / values[0] - 1) * 100;
    change.textContent = UI.signedPct(percent);
    change.className = UI.trendClass(percent);
    document.getElementById('previewSummary').textContent = range + ' sample · normalized starting value of 100';
    chart.setAttribute('aria-label', range + ' illustrative index: from ' + values[0] + ' to ' + last + '. Not live market data.');
    buttons.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.previewRange === range)); });
  }
  buttons.forEach(function (button) { button.addEventListener('click', function () { selectRange(button.dataset.previewRange); }); });
  selectRange('1Y');

  const photos = [
    ['assets/city.jpg', 'City skyline with warm evening light'],
    ['assets/architecture.jpg', 'Modern glass office towers'],
    ['assets/research.jpg', 'Financial research and charts on a laptop']
  ];
  document.querySelectorAll('#homeInsights .insight-img').forEach(function (container, index) {
    const img = document.createElement('img');
    img.src = photos[index][0];
    img.alt = photos[index][1];
    img.loading = 'lazy';
    img.width = 900;
    img.height = 600;
    container.prepend(img);
  });
})();
