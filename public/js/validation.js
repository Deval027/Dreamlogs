const form = document.getElementById('registrationForm');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const email = document.getElementById('registerEmail').value;

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
    errorElement.style.position = 'absolute';
    errorElement.style.top = '0';
    errorElement.style.left = '50%';
    errorElement.style.transform = 'translateX(-50%)';
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    errorElement.textContent = errorMessage;
    
    const loginDiv = document.getElementsByClassName('signup')[0];
    const form = loginDiv.querySelector('form');
    
    if (loginDiv && form) {
      loginDiv.insertBefore(errorElement, form);
    }
    
    return; // If there's an error, stop here and don't make the fetch call
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
    return; // If there's an error, stop here and don't make the fetch call
  }

  const jsonData = JSON.stringify({
    username: username,
    password: password,
    email: email,
  });

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

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); 
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const loginData = {
      username: username,
      password: password
  };


  fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
  })
  .then(response => {
    return response.json();
})

});
