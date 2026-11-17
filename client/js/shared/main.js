// Main: browser page behavior and helpers.
// Shared page behavior. A function wrapper keeps these variables private.
(async function () {
  const navbar = document.querySelector('.navbar');
  const active = document.querySelector('nav a[href="' + document.body.dataset.page + '.html"]');
  if (active) { active.classList.add('active'); active.setAttribute('aria-current', 'page'); }

  if (navbar) {
    const toggle = document.querySelector('.nav-toggle');
    // Close mobile navigation and update its accessible state.
  function closeMenu() {
      navbar.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }
    toggle.addEventListener('click', function () {
      const open = navbar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navbar.classList.contains('open')) { closeMenu(); toggle.focus(); }
    });
    document.addEventListener('click', function (event) { if (!navbar.contains(event.target)) closeMenu(); });
    navbar.querySelectorAll('nav a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (event) { if (event.matches) closeMenu(); });
  }

  await API.ready;
  const user = API.user;
  if (user && navbar) {
    const account = document.querySelector('.account-link');
    account.textContent = 'Sign out';
    account.addEventListener('click', async function (event) {
      event.preventDefault();
      try {
        await API.request('/api/signout', 'POST', {});
        location.href = 'index.html';
      } catch (error) {
        const note = document.querySelector('[data-feed-status]');
        if (note) note.textContent = 'Could not sign out: ' + error.message;
      }
    });
  }

  // HTML starts hidden, so guests never briefly see the account content.
  document.querySelectorAll('[data-signed-in]').forEach(function (element) { element.hidden = !user; });
  document.querySelectorAll('[data-signed-out]').forEach(function (element) { element.hidden = Boolean(user); });
  if (user && document.querySelector('[data-portfolio]')) {
    try {
      const portfolio = await API.request('/api/portfolio');
      document.querySelectorAll('[data-portfolio]').forEach(element => { element.textContent = UI.money(portfolio[element.dataset.portfolio === 'value' ? 'total' : element.dataset.portfolio]); });
    } catch (error) { document.querySelectorAll('[data-portfolio]').forEach(element => { element.textContent = 'Portfolio unavailable'; }); }
  }
  // Recheck sign-in after Back restores a cached page.
  window.addEventListener('pageshow', function (event) { if (event.persisted) location.reload(); });

})();
