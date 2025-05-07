const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

document.getElementById('reset-password-form').addEventListener('submit', function (e) {
  e.preventDefault();
  let errorMessage = ''
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Remove old error message
  const oldErrorMessage = document.getElementById('errorMessage');
  if (oldErrorMessage) {
    oldErrorMessage.remove();
  }

  //Set error message in case of bad input
  if (newPassword !== confirmPassword) {
    errorMessage = 'Passwords do not match';
    document.getElementById('new-password').value = '';
    document.getElementById('confirmPassword').value = '';
  } else if (password.length < 8) {
    errorMessage = 'Password must be at least 8 characters long';
  }else if (newPassword == '1234678') {
    errorMessage = 'You can not use that password';
  }
  if (errorMessage !== '') {
    alertMessage(errorMessage)
    errorMessage = ''
    return
  }

  fetch('/api/resetpassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  })
  .then(response => response.json())
  .then(data => {
    alertMessage(data.message);
    if (data.message === 'Password reset successfully') {
      setTimeout(() => {
        window.location.href = '/'; // Redirect after 5 seconds
      }, 5000); 
    }
  })
  .catch(err => {
    console.error('Error resetting password:', err);
  });
});