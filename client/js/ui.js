// Small helpers used by several pages. UI keeps their names in one place.
const UI = {
  money: function (value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  },
  number: function (value) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  },
  signedPct: function (value) {
    return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
  },
  trendClass: function (value) { return value < 0 ? 'down' : 'up'; },
  price: function (value, decimals) {
    return decimals ? '$' + value.toFixed(decimals) : UI.money(value);
  },

  // Send an object as JSON. Throw errors so each form can use one try/catch.
  postJson: async function (url, values) {
    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
    } catch (error) {
      throw new Error('Could not reach the server. Run: npm run dev');
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not save the form.');
    return data;
  },

  // Convert numbers into an SVG line. High values have smaller y coordinates.
  plot: function (svg, values) {
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
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function () { document.body.classList.remove('dialog-open'); });
  },
  openDialog: function (dialog) {
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
};
