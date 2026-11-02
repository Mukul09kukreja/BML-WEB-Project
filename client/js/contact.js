// Validate -> send JSON -> show the saved record. The server repeats all validation.
(function () {
  const form = document.getElementById('contactForm');
  const name = document.getElementById('contactName');
  const message = document.getElementById('contactMessage');
  const status = document.getElementById('contactStatus');
  const button = document.getElementById('contactSubmit');
  const success = document.getElementById('contactSuccess');
  const counter = document.getElementById('messageCount');

  message.addEventListener('input', function () {
    message.setCustomValidity('');
    counter.textContent = message.value.trim().length + ' / 500';
  });
  name.addEventListener('input', function () { name.setCustomValidity(''); });
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    name.setCustomValidity(name.value.trim().length < 2 ? 'Enter at least 2 characters.' : '');
    const length = message.value.trim().length;
    message.setCustomValidity(length < 20 || length > 500 ? 'Write between 20 and 500 characters.' : '');
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.textContent = 'Sending...';
    try {
      const result = await UI.postJson('/api/contact', {
        name: name.value.trim(), email: form.elements.email.value.trim(), topic: form.elements.topic.value,
        message: message.value.trim(), consent: document.getElementById('contactConsent').checked
      });
      document.getElementById('contactSuccessDetail').textContent = 'Saved reference: ' + result.id;
      form.hidden = true;
      success.hidden = false;
      success.querySelector('h2').focus();
      status.textContent = '';
    } catch (error) { status.textContent = error.message; }
    finally { button.disabled = false; }
  });
  document.getElementById('contactAgain').addEventListener('click', function () {
    form.reset();
    counter.textContent = '0 / 500';
    success.hidden = true;
    form.hidden = false;
    name.focus();
  });
})();
