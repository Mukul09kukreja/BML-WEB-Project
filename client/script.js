// small bits of interaction shared by the inner pages

// time range buttons on the market overview chart
document.querySelectorAll('.range-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.range-buttons button').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
  });
});

// category chips: filter the markets table, or just highlight on the news page
const chips = document.querySelectorAll('.chip');
const rows = document.querySelectorAll('tbody tr[data-type]');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('on'));
    chip.classList.add('on');

    const type = chip.dataset.filter;
    if (!type) return;
    rows.forEach(row => {
      row.classList.toggle('hidden', type !== 'all' && row.dataset.type !== type);
    });
  });
});

// search box filters the table by name or ticker
const search = document.querySelector('.search-box input');
if (search) {
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    rows.forEach(row => {
      row.classList.toggle('hidden', q && !row.textContent.toLowerCase().includes(q));
    });
  });
}
