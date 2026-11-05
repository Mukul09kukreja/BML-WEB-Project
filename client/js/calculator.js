// Each input event recalculates a hypothetical plan at 7% annually.
(function () {
  const initial = document.getElementById('initial');
  const monthly = document.getElementById('monthly');
  const years = document.getElementById('years');
  // Restore the last saved plan, if one exists in this browser.
  const saved = Store.get('stockpie.calculator', null);
  if (saved) {
    initial.value = saved.start;
    monthly.value = saved.monthly;
    years.value = saved.years;
  }
  function update() {
    // Slider values are strings; convert them to numbers for calculations.
    const start = Number(initial.value);
    const contribution = Number(monthly.value);
    const duration = Number(years.value);
    let balance = start;
    const values = [balance];
    // Grow the balance, add a contribution each month, and record each year end.
    for (let month = 1; month <= duration * 12; month++) {
      balance = balance * (1 + 0.07 / 12) + contribution;
      if (month % 12 === 0) values.push(balance);
    }
    // Contributions are the money added; growth is the final balance minus contributions.
    const invested = start + contribution * duration * 12;
    document.getElementById('initialOut').textContent = UI.money(start);
    document.getElementById('monthlyOut').textContent = UI.money(contribution);
    document.getElementById('yearsOut').textContent = duration + ' years';
    document.getElementById('finalValue').textContent = UI.money(balance);
    document.getElementById('invested').textContent = UI.money(invested);
    document.getElementById('growth').textContent = UI.money(balance - invested);
    document.getElementById('calcNote').textContent = duration + ' years at an assumed 7% annual return';
    // Draw the yearly balances and update each slider's filled track.
    UI.plot(document.getElementById('calcChart'), values);
    [initial, monthly, years].forEach(function (slider) {
      slider.style.setProperty('--fill', (slider.value - slider.min) / (slider.max - slider.min) * 100 + '%');
    });
  }
  // Recalculate while dragging; only the Save button stores the inputs.
  [initial, monthly, years].forEach(function (slider) { slider.addEventListener('input', update); });
  document.getElementById('savePlan').addEventListener('click', function () {
    const ok = Store.set('stockpie.calculator', { start: Number(initial.value), monthly: Number(monthly.value), years: Number(years.value) });
    document.getElementById('planStatus').textContent = ok ? 'Plan saved to this browser.' : 'Browser storage is unavailable.';
  });
  // Display the initial or restored plan as soon as the page loads.
  update();
})();
