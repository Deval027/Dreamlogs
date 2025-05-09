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
  if (username === '' || password === '') {
    errorMessage = 'Username and password are required';
  } else if (password !== confirmPassword) {
    errorMessage = 'Passwords do not match';
    document.getElementById('registerPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  } else if (password.length < 8) {
    errorMessage = 'Password must be at least 8 characters long';
  }
  //Email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage = 'Invalid email'
  }

  if (errorMessage !== '') {
    alertMessage(errorMessage)
    errorMessage = ''
    return
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
      alertMessage('Username already exists')
    } else if(data.emailExists){
      alertMessage('email is already in use')
    } else if (data.success) {
      alertMessage('Sign up Succesfull')
      form.reset()
    } else {
      alertMessage('Registration was not succesfull, please try again')
      form.reset()
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
