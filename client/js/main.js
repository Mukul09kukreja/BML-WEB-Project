// Shared page behavior. A function wrapper keeps these variables private.
(function () {
  const user = Store.user();
  const navbar = document.querySelector('.navbar');
  const active = document.querySelector('nav a[href="' + document.body.dataset.page + '.html"]');
  if (active) active.classList.add('active');

  if (navbar) {
    const toggle = document.querySelector('.nav-toggle');
    toggle.addEventListener('click', function () {
      const open = navbar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    if (user) {
      const account = document.querySelector('.account-link');
      account.textContent = 'Sign out';
      account.addEventListener('click', function (event) {
        event.preventDefault();
        Store.clearUser();
        location.href = 'index.html';
      });
    }
  }

  // HTML starts hidden, so guests never briefly see the sample holdings.
  document.querySelectorAll('[data-signed-in]').forEach(function (element) { element.hidden = !user; });
  document.querySelectorAll('[data-signed-out]').forEach(function (element) { element.hidden = Boolean(user); });
  document.querySelectorAll('[data-portfolio]').forEach(function (element) {
    const key = element.dataset.portfolio;
    const value = STOCKPIE.portfolio[key];
    element.textContent = key === 'returnPct' ? UI.signedPct(value) : UI.money(value);
  });
  // Recheck sign-in after Back restores a cached page or another tab signs out.
  window.addEventListener('pageshow', function (event) { if (event.persisted) location.reload(); });
  window.addEventListener('storage', function (event) { if (!event.key || event.key === 'stockpie.user') location.reload(); });

  const form = document.querySelector('.js-newsletter');
  if (!form) return;
  const status = form.querySelector('[data-error]');
  const button = form.querySelector('button');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.textContent = 'Saving...';
    try {
      const result = await UI.postJson('/api/subscribe', { email: form.elements.email.value.trim() });
      status.textContent = result.message;
      form.reset();
    } catch (error) { status.textContent = error.message; }
    finally { button.disabled = false; }
  });
})();
