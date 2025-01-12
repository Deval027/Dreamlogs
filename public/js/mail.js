const form = document.getElementById('mailForm');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const jsonData = JSON.stringify({
    email: email,
  });

  fetch('/mailValidation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonData,
  })
  .then(response => response.json())
  .then(data => {
  
      if (data.success) {
      alert(data.result);
      location.reload(false);
    } else {
      alert('valio madre');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

