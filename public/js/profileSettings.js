let user

function getCurrentUsername() {
  // Get the div element by its ID
  const div = document.getElementById('40');
  
  // Get the text inside the div
  const text = div.textContent;
  
  // Print the text to the console
  user = text.replace('Username:','').trim();
 
}


setTimeout(getCurrentUsername, 1000);

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('90').addEventListener('click', function() {
      const formContainer = `
          <div id="form-container">
              <h2>Change Username</h2>
              <form id="submitForm" action="/submit-username" method="post">
                  <label for="new-username">New Username:</label>
                  <input type="text" id="new-username" name="username" required><br><br>
                  <button type="submit">Submit</button>
              </form>
          </div>
      `;

      document.getElementById('95').innerHTML = formContainer;
       // Add form submit event listener
       document.getElementById('submitForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('lowkey good at this point');
        console.log(user)
        const newUsername = document.getElementById('new-username').value;
        const oldErrorMessage = document.getElementById('errorMessage');
        if (oldErrorMessage) {
          oldErrorMessage.remove();
        }
        let errorMessage = '';
          if (newUsername === '') {
            errorMessage = 'F';
            alert('no username given putamadremevoyasuicidar')
          }
          else if (newUsername === user){
            errorMessage = 'F';
            alert("username needs to be diferent from the current one puta") 
          }
          if (errorMessage !== '') {
            console.log("Error")
            return; 
          }
          const jsonData = JSON.stringify({
            username: newUsername,
          });
          fetch('submit-username', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: jsonData,
          })
          
          .then(response => response.json())
          .then(data => {
              if (data.redirect) {
                  window.location.href = data.redirect; // Redirect to the new URL
                  window.location.reload(true);
              }
              else{
                window.location.reload(true);
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
              });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('91').addEventListener('click', function() {
      const formContainer = `
          <div id="form-container">
              <h2>Change Password</h2>
              <form id="submitForm" action="/submit-password" method="post">
                  <label for="new-password">New Password:</label>
                  <input type="password" id="old-password" old="password" required><br><br>
                  <input type="password" id="new-password" name="password" required><br><br>
                  <button type="submit">Change password</button>
              </form>
          </div>
      `;
      document.getElementById('95').innerHTML = formContainer;
       // Add form submit event listener
       document.getElementById('submitForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('lowkey good at this point');
        const newPassword = document.getElementById('new-password').value;
        console.log(newPassword)
        const oldErrorMessage = document.getElementById('errorMessage');
        if (oldErrorMessage) {
          oldErrorMessage.remove();
        }
        let errorMessage = '';
          if (newPassword === '') {
            errorMessage = 'F';
            alert('no username given putamadremevoyasuicidar')
          }
          if (errorMessage !== '') {
            console.log("Error")
            return; // If there's an error, stop here and don't make the fetch call
          }
          const jsonData = JSON.stringify({
            password: newPassword,
          });
          fetch('/submit-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        })

      
        .then(response => response.json())
          .then(data => {
              if (data.redirect) {
                  window.location.href = data.redirect; // Redirect to the new URL
                  window.location.reload(true);
              }
              else{
                window.location.reload(true);
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
              });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('92').addEventListener('click', function() {
      const formContainer = `
          <div id="form-container">
          <h2>Delete Account</h2>
          <form id="submitForm" action="/submit-delete-account" method="post">
              <label for="confirm">Your account will be permanently deleted, are you sure?</label>
              <a href='submit-delete-account'>Delete</a>
          </form>
      </div>
      `;

      document.getElementById('95').innerHTML = formContainer;
      
  });
  

  
});

fetch('/api/userId')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          // Handle error if any
          document.getElementById('40').innerText = 'Error: ' + data.error;
        } else {
          // Display the username in the div
          document.getElementById('40').innerText = "Username:" + data.username;
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

 fetch('/userLogs')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          // Handle error if any
          document.getElementById('60').innerText = 'Error: ' + data.error;
        } else {
          // Display the username and post count in the div
          document.getElementById('60').innerText = 'Logs: ' + data.postCount;
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });


var SettingsVisual = document.getElementsByClassName("accountSetting")
var Setbutton = document.getElementById("80")

var formSettings = document.getElementById("95")
function OpenWindow() {
  for (var i = 0; i < SettingsVisual.length; i++) {
      if (SettingsVisual[i].style.display === 'block') {
          SettingsVisual[i].style.display = 'none';
      } else {
          SettingsVisual[i].style.display = 'block';
      }
  }
  for (var i = 0; i < formSettings.length; i++) {
    if (formSettings[i].style.display === 'block') {
        formSettings[i].style.display = 'none';
    } else {
        formSettings[i].style.display = 'block';
    }
}
} 
Setbutton.addEventListener("click", OpenWindow);


