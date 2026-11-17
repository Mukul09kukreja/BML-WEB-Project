// Auth: browser page behavior and helpers.
(async function () {
  await API.ready;
  const form = document.getElementById('authForm');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const remember = document.getElementById('remember');
  const button = document.getElementById('submitBtn');
  const status = document.getElementById('formMessage');
  const switchButton = document.getElementById('switchLink');
  const symbol = new URLSearchParams(location.search).get('symbol');
  let mode = new URLSearchParams(location.search).get('mode') === 'signup' ? 'signup' : 'signin';

  // Display feedback beside the form.
  function showMessage(message, kind = '') {
    status.textContent = message;
    status.className = `form-message${kind ? ' ' + kind : ''}`;
  }

  username.value = Store.get('stockpie.username', '');
  remember.checked = Boolean(username.value);

  // Update labels for signing in or creating an account.
  function showMode() {
    const signup = mode === 'signup';
    document.getElementById('authEyebrow').textContent = signup ? 'Create an account' : 'Welcome back';
    document.title = signup ? 'Create account - StockPie' : 'Sign in - StockPie';
    document.getElementById('formTitle').textContent = signup ? 'Create your account' : 'Sign in to StockPie';
    button.textContent = signup ? 'Create account' : 'Sign in';
    document.getElementById('switchPrompt').textContent = signup ? 'Already have an account?' : 'New to StockPie?';
    switchButton.textContent = signup ? 'Sign in' : 'Create account';
    password.autocomplete = signup ? 'new-password' : 'current-password';
    showMessage('');
  }

  switchButton.addEventListener('click', () => { mode = mode === 'signup' ? 'signin' : 'signup'; showMode(); });
  document.getElementById('revealPassword').addEventListener('click', event => {
    password.type = password.type === 'password' ? 'text' : 'password';
    event.target.textContent = password.type === 'password' ? 'Show' : 'Hide';
    event.target.setAttribute('aria-label', password.type === 'password' ? 'Show password' : 'Hide password');
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    showMessage('Please wait…');
    try {
      if (!API.csrf) await API.session();
      if (new TextEncoder().encode(password.value).length > 72) throw new Error('Password must be at most 72 UTF-8 bytes.');
      const result = await API.request('/api/' + mode, 'POST', { username: username.value.trim(), password: password.value });
      if (remember.checked) Store.set('stockpie.username', username.value.trim());
      else Store.remove('stockpie.username');
      if (mode === 'signup') {
        mode = 'signin';
        showMode();
        showMessage(result.message, 'ok');
      } else location.href = 'portfolio.html' + (symbol ? '?symbol=' + encodeURIComponent(symbol) : '');
    } catch (error) { showMessage(error.message, 'error'); }
    finally { button.disabled = false; }
  });
  showMode();
  if (API.error) showMessage(API.error, 'error');
})();
