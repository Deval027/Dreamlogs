fetch('/api/userId')
  .then(response => response.json())
  .then(data => {
    const userId = data.userId;
    console.log(userId); // or do something else with the user ID
  });

