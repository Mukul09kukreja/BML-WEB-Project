// Sign in / create account form for sign-in.html
// Sends the details to server.js, which stores them in data/users.json

const form = document.getElementById('authForm');
const title = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('formMessage');
const switchText = document.getElementById('switchText');

let mode = 'signin';   // or 'signup'

function showMessage(text, isError) {
  message.textContent = text;
  message.className = 'form-message ' + (isError ? 'error' : 'ok');
}

// "Create account" / "Sign in" link under the form swaps the mode
function setMode(newMode) {
  mode = newMode;
  const signingUp = mode === 'signup';
  title.textContent = signingUp ? 'Create your account' : 'Sign in to StockPie';
  submitBtn.textContent = signingUp ? 'Create account' : 'Sign in';
  switchText.innerHTML = signingUp
    ? 'Already have an account? <a href="#" class="gold-text" id="switchLink">Sign in</a>'
    : 'Don’t have an account? <a href="#" class="gold-text" id="switchLink">Create account</a>';
  message.textContent = '';
  bindSwitch();
}

function bindSwitch() {
  document.getElementById('switchLink').addEventListener('click', e => {
    e.preventDefault();
    setMode(mode === 'signin' ? 'signup' : 'signin');
  });
}
bindSwitch();

form.addEventListener('submit', async e => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  submitBtn.disabled = true;
  try {
    const res = await fetch('/api/' + mode, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) return showMessage(data.error, true);

    showMessage(data.message, false);
    if (mode === 'signup') {
      setMode('signin');
      showMessage(data.message, false);
    } else {
      setTimeout(() => { window.location.href = 'market-overview.html'; }, 800);
    }
  } catch {
    showMessage('Could not reach the server. Start it with: node server.js', true);
  } finally {
    submitBtn.disabled = false;
  }
});