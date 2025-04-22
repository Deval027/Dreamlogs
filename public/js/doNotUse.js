//idk what this does



let user

function getCurrentUsername() {
  const div = document.getElementById('40');
  
  const text = div.textContent;
  
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
          fetch('/submit-username', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: jsonData,
})
  .then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert(data.message); 
                  setTimeout(() => {
                      if (data.redirect) {
                          window.location.href = data.redirect;
                      } else {
                          window.location.reload(true); 
                      }
                  }, 10); 
              } else {
                  alert(data.message); 
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
          <form id="submitPsw" action="/submit-password" method="post">
              <label for="Currentpsw">Current password:</label><br>
              <input type="password" id="password" class="newPass" name="password" required=""><br>
              <label for="new-password">New password:</label>
              <input class="newPass" type="password" id="new-password" name="password" required><br><br>
              <button class="sub" type="submit">Change password</button>
          </form>
      </div>
      `;
      document.getElementById('95').innerHTML = formContainer;
       document.getElementById('submitPsw').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('lowkey good at this point');
        const newPassword = document.getElementById('password').value;
        const oldPassword = document.getElementById('new-Password').value;
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
            return; 
          }
          const jsonData = JSON.stringify({
            oldPassword: oldPassword,
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
            if (data.success) {
                alert(data.message); 
                setTimeout(() => {
                    if (data.redirect) {
                        window.location.href = data.redirect; 
                    } else {
                        window.location.reload(true); 
                    }
                }, 10); 
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
        
              });
  });
  console.log("DAta",jsonData)
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('92').addEventListener('click', function() {
      const formContainer = `
          <div id="form-container">
              <h2>Delete Account</h2>
              <form id="submitForm" action="/submit-delete-account" method="post">
                  <label for="confirm">Your account will be permanently deleted, are you sure?</label><br><br>
                  <label for="password">Enter your password for confirmation:</label><br>
                  <input type="password" id="password" name="password" required><br><br>
                  <button type="submit">Delete</button>
              </form>
          </div>
      `;

      document.getElementById('95').innerHTML = formContainer;

      document.getElementById('submitForm').addEventListener('submit', function(event) {
          event.preventDefault();

          const password = document.getElementById('password').value;

          if (password === '') {
              alert('Password cannot be empty');
              return;
          }

          const jsonData = JSON.stringify({
              password: password
          });

          fetch('/submit-delete-account', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: jsonData,
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert(data.message); 
                  setTimeout(() => {
                      if (data.redirect) {
                          window.location.href = data.redirect;
                      } else {
                          window.location.reload(true); 
                      }
                  }, 100); 
              } else {
                  alert(data.message); 
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
      });
  });
});


fetch('/api/userId')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById('40').innerText = 'Error: ' + data.error;
        } else {
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
          document.getElementById('60').innerText = 'Error: ' + data.error;
        } else {
          document.getElementById('60').innerText = 'Logs: ' + data.postCount;
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

var form = document.getElementsByClassName("form-container")
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


