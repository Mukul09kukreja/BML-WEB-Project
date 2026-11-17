// Ui: browser page behavior and helpers.
// Small helpers used by several pages. UI keeps their names in one place.
const UI = {
  money: function (value) {
    if (value === null || value === undefined) return 'Unavailable';
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
  },
  signedPct: function (value) {
    if (!Number.isFinite(value)) return '—';
    return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
  },
  trendClass: function (value) { return value < 0 ? 'down' : value > 0 ? 'up' : ''; },
  quoteTime: function (value) {
    return value ? new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST' : 'No quote';
  },
  // Convert numbers into an SVG line. High values have smaller y coordinates.
  plot: function (svg, values) {
    if (!values.length) return;
    if (values.length === 1) values = [values[0], values[0]];
    const width = svg.viewBox.baseVal.width;
    const height = svg.viewBox.baseVal.height;
    const low = Math.min(...values);
    const high = Math.max(...values);
    const points = values.map(function (value, index) {
      const x = 8 + index * (width - 16) / (values.length - 1);
      const y = height - 8 - (value - low) / (high - low || 1) * (height - 16);
      return x + ' ' + y;
    });
    const line = 'M' + points.join(' L');
    svg.querySelector('.chart-line').setAttribute('d', line);
    svg.querySelector('.chart-area').setAttribute('d', line + ' L' + (width - 8) + ' ' + height + ' L8 ' + height + ' Z');
  },

  // Native dialogs already handle Escape and keyboard focus. Only bind the close controls.
  bindDialog: function (dialog) {
    dialog.querySelectorAll('[data-close]').forEach(function (button) {
      button.addEventListener('click', function () { dialog.close(); });
    });
    dialog.addEventListener('click', function (event) {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', function () { document.body.classList.remove('dialog-open'); });
  },
  openDialog: function (dialog) {
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
};
