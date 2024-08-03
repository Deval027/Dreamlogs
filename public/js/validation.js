const form = document.getElementById('registrationForm');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const email = document.getElementById('registerEmail').value;

  const oldErrorMessage = document.getElementById('errorMessage');
  if (oldErrorMessage) {
    oldErrorMessage.remove();
  }

  let errorMessage = '';
  if (username === '' || password === '') {
    errorMessage = 'Username and password are required';
  } else if (password !== confirmPassword) {
    errorMessage = 'Passwords do not match';
  } else if (password.length < 8) {
    errorMessage = 'Password must be at least 8 characters long';
  }

  if (errorMessage !== '') {
    const errorElement = document.createElement('span');
    errorElement.id = 'errorMessage';
    errorElement.style.color = 'red';
    errorElement.textContent = errorMessage;

    form.appendChild(errorElement);

    return; 
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const errorElement = document.createElement('span');
    errorElement.style.color = 'red';
    errorElement.textContent = 'Invalid email format';
    form.appendChild(errorElement);f
    return; 
  }

  const jsonData = JSON.stringify({
    username: username,
    password: password,
    email: email,
  });

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonData,
  })
  .then(response => response.json())
  .then(data => {
    if (data.usernameExists) {
      alert('Username already exists');
    } else if (data.success) {
      alert('Registration successful');
      location.reload(false);
    } else {
      alert('Registration failed');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

