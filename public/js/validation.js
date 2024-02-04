const form = document.getElementById('registrationForm');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: event.target.registerUsername.value,
      password: event.target.registerPassword.value,
      email: event.target.registerEmail.value
    })
  });
});
form.addEventListener('submit', function(event) {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const email = document.getElementById('registerEmail').value;
  event.preventDefault();
    // Remove old error message
    const oldErrorMessage = document.getElementById('errorMessage');
    if (oldErrorMessage) {
        oldErrorMessage.remove();
    }

    // Validate form values
    let errorMessage = '';
    if (username === '' || password === '') {
        errorMessage = 'Username and password are required';
    } else if (password !== confirmPassword) {
        errorMessage = 'Passwords do not match';
    } else if (password.length < 8) {
        errorMessage = 'Password must be at least 8 characters long';
    }
        if (errorMessage !== '') {
            // Create new error message
            const errorElement = document.createElement('span');
        errorElement.id = 'errorMessage';
        errorElement.style.color = 'red';
        errorElement.textContent = errorMessage;

        // Append error message to form
        form.appendChild(errorElement);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        // Show error message
        const errorElement = document.createElement('span');
        errorElement.style.color = 'red';
        errorElement.textContent = 'Invalid email format';

        // Append error message to form
        form.appendChild(errorElement);

        // Prevent form submission
        event.preventDefault();
    }
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password, email: email }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.usernameExists) {
        alert('Username already exists');
      } else if (data.success) {
        // Handle successful registration
        alert('Registration successful');
        location.reload(false);
      } else {
        // Handle registration error
        alert('Registration failed');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    const jsonData = JSON.stringify({
        username: username,
        password: password,
        email: email,
      });
    
      // Print JSON data to console
    
      // Send data to server
      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Registration was successful
          // Redirect user, show success message, etc.
        } else {
          // Registration failed
          // Show error message
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });