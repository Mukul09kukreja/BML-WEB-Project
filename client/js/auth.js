// One form serves both endpoints. Each submit reads fields, validates, then awaits the server.
(function () {
  const form = document.getElementById('authForm'); //get element from html with this id
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const remember = document.getElementById('remember');
  const button = document.getElementById('submitBtn');
  const status = document.getElementById('formMessage');
  const switchButton = document.getElementById('switchLink');
  let mode = new URLSearchParams(location.search).get('mode') === 'signup' ? 'signup' : 'signin';

  function showMode() {
    const signup = mode === 'signup';
    document.getElementById('formTitle').textContent = signup ? 'Create your account' : 'Sign in to StockPie';
    button.textContent = signup ? 'Create account' : 'Sign in';
    document.getElementById('switchPrompt').textContent = signup ? 'Already have an account?' : 'New to StockPie?';
    switchButton.textContent = signup ? 'Sign in' : 'Create account';
    password.autocomplete = signup ? 'new-password' : 'current-password';
    status.textContent = '';
  }
  email.value = Store.get('stockpie.remember', '');
  remember.checked = Boolean(email.value);
  switchButton.addEventListener('click', function () { mode = mode === 'signup' ? 'signin' : 'signup'; showMode(); });
  document.getElementById('revealPassword').addEventListener('click', function (event) {
    password.type = password.type === 'password' ? 'text' : 'password';
    event.target.textContent = password.type === 'password' ? 'Show' : 'Hide';
    event.target.setAttribute('aria-label', password.type === 'password' ? 'Show password' : 'Hide password');
  });
  password.addEventListener('input', function () { password.setCustomValidity(''); });

  form.addEventListener('submit', async function (event) { // tranferr your credentials to server
    event.preventDefault();
    password.setCustomValidity(password.value.length < 8 ? 'Use at least 8 characters.' : '');
    if (!form.reportValidity()) return;
    button.disabled = true;
    switchButton.disabled = true;
    status.textContent = 'Please wait...';
    try {
      const result = await UI.postJson('/api/' + mode, { email: email.value.trim(), password: password.value });
      if (remember.checked) Store.set('stockpie.remember', email.value.trim());
      else Store.remove('stockpie.remember');
      if (mode === 'signup') {
        mode = 'signin';
        showMode();
        status.textContent = result.message + ' Sign in to continue.';
      } else {
        Store.setUser(result.email);
        location.href = 'portfolio.html';
      }
    } catch (error) { status.textContent = error.message; }
    finally { button.disabled = false; switchButton.disabled = false; }
  });
  showMode();
})();
