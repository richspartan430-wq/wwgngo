// Contact + newsletter form handlers — posts to /api/contact and /api/newsletter
(function () {
  function showMsg(form, type, text) {
    let box = form.querySelector('.form-msg');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-msg';
      form.appendChild(box);
    }
    box.className = 'form-msg ' + type;
    box.textContent = text;
  }

  async function submitForm(form, url, successReset) {
    const submitBtn = form.querySelector('button[type=submit], input[type=submit]');
    const originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    try {
      const formData = new FormData(form);
      const payload = {};
      formData.forEach((v, k) => { payload[k] = v; });
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'fetch' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        showMsg(form, 'success', data.message || 'Thank you! We have received your submission.');
        if (successReset) form.reset();
      } else {
        showMsg(form, 'error', data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      showMsg(form, 'error', 'Network error. Please check your connection and try again.');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-form="contact"]').forEach(f => {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        submitForm(f, '/api/contact', true);
      });
    });
    document.querySelectorAll('form[data-form="newsletter"]').forEach(f => {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        submitForm(f, '/api/newsletter', true);
      });
    });
  });
})();
