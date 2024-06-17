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
function OpenWindow() {
  for (var i = 0; i < SettingsVisual.length; i++) {
      if (SettingsVisual[i].style.display === 'block') {
          SettingsVisual[i].style.display = 'none';
      } else {
          SettingsVisual[i].style.display = 'block';
      }
  }
}
Setbutton.addEventListener("click", OpenWindow);