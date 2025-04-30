fetch('/api/userId')
  .then(response => response.json())
  .then(data => {
    const userId = data.userId;
    document.getElementById('userId').value = userId;
  })
  .catch(error => console.error('Error:', error));
