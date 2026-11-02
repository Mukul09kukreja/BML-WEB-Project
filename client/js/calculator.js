// Each input event recalculates a hypothetical plan at 7% annually.
(function () {
  const initial = document.getElementById('initial');
  const monthly = document.getElementById('monthly');
  const years = document.getElementById('years');
  const saved = Store.get('stockpie.calculator', null);
  if (saved) {
    initial.value = saved.start;
    monthly.value = saved.monthly;
    years.value = saved.years;
  }
  function update() {
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
    const invested = start + contribution * duration * 12;
    document.getElementById('initialOut').textContent = UI.money(start);
    document.getElementById('monthlyOut').textContent = UI.money(contribution);
    document.getElementById('yearsOut').textContent = duration + ' years';
    document.getElementById('finalValue').textContent = UI.money(balance);
    document.getElementById('invested').textContent = UI.money(invested);
    document.getElementById('growth').textContent = UI.money(balance - invested);
    document.getElementById('calcNote').textContent = duration + ' years at an assumed 7% annual return';
    UI.plot(document.getElementById('calcChart'), values);
    [initial, monthly, years].forEach(function (slider) {
      slider.style.setProperty('--fill', (slider.value - slider.min) / (slider.max - slider.min) * 100 + '%');
    });
  }
  [initial, monthly, years].forEach(function (slider) { slider.addEventListener('input', update); });
  document.getElementById('savePlan').addEventListener('click', function () {
    const ok = Store.set('stockpie.calculator', { start: Number(initial.value), monthly: Number(monthly.value), years: Number(years.value) });
    document.getElementById('planStatus').textContent = ok ? 'Plan saved to this browser.' : 'Browser storage is unavailable.';
  });
  update();
})();
