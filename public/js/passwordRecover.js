document.getElementById('recoverPass').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    console.log(email)
    try {
      const res = await fetch('/api/querymail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      document.getElementById('status-message').textContent = data.message || 'Request sent.';
    } catch (err) {
      console.error(err);
      document.getElementById('status-message').textContent = 'Something went wrong. Try again.';
    }
  });