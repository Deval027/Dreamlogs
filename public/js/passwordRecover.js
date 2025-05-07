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
      alertMessage(data.message)
    } catch (err) {
      console.error(err);
      alertMessage('Something went wrong try again')
    }
  });