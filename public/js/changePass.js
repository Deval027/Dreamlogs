const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

document.getElementById('reset-password-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const newPassword = document.getElementById('new-password').value;

  // Send request to backend to reset password
  fetch('/api/resetpassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    if (data.message === 'Password reset successfully') {
      window.location.href = '/'; // Redirect to login page
    }
  })
  .catch(err => {
    console.error('Error resetting password:', err);
  });
});