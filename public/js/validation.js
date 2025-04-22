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

  //Set error message in case of bad input
  let errorMessage = '';
  if (username === '' || password === '') {
    errorMessage = 'Username and password are required';
  } else if (password !== confirmPassword) {
    errorMessage = 'Passwords do not match';
  } else if (password.length < 8) {
    errorMessage = 'Password must be at least 8 characters long';
  }
  //Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    // Show error message
    errorMessage = 'Invalid email'
  }

  //in case there is a bad input display error and stop the code
  if (errorMessage !== '') {
    const existingBox = document.getElementById('errorBox');
    if (existingBox) existingBox.remove();
      const box = document.createElement('div');
      box.id = 'errorBox';
      box.textContent = errorMessage;
      document.body.appendChild(box);
      const progress = document.createElement('div');
      progress.id = 'errorProgress';

      // Append progress to box
      box.appendChild(progress);
      document.body.appendChild(box);

      // Remove the box when animation ends
      progress.addEventListener('animationend', () => {
        box.remove();
      });
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
