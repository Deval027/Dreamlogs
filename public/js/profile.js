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

function showForm(formUrl) {
  fetch(formUrl)
      .then(response => response.text())
      .then(html => {
          const container = document.getElementById('95');
          container.innerHTML = html;

          const form = container.querySelector('form');
          if (form) {
              form.addEventListener('submit', function(event) {
                  event.preventDefault();

                  const formData = new FormData(form);
                  fetch(form.action, {
                      method: 'POST',
                      body: formData
                  })
                  .then(response => response.text())
                  .then(result => {
                      console.log('Form submitted successfully:', result);
                      container.innerHTML = result;
                  })
                  .catch(error => {
                      console.error('Error submitting form:', error);
                  });
              });
          } else {
              console.error('Form not found');
          }
      })
      .catch(error => {
          console.error('Error fetching form:', error);
      });
}