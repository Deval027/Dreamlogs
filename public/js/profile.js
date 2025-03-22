fetch('/api/userId')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById('40').innerText = 'Error: ' + data.error;
        } else {
          document.getElementById('40').innerText = "Username: " + data.username;
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
          document.getElementById('60').innerText = 'Dreams: ' + data.postCount;
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });


var SettingsVisual = document.getElementsByClassName("accountSetting")
var Setbutton = document.getElementById("80")
var form = document.getElementById("form-container")
console.log(form)
function OpenWindow() {

  for (var i = 0; i < SettingsVisual.length; i++) {
      if (SettingsVisual[i].style.display === 'block') {
          SettingsVisual[i].style.display = 'none';
      } else {
          SettingsVisual[i].style.display = 'block';
      }
  }

  for (var i = 0; i < form.length; i++) {
      if (form[i].style.display === 'block') {
          form[i].style.display = 'none';
      } else {
          form[i].style.display = 'block';
      }
  }
  if (form) {
      if (form.style.display === 'block') {
          form.style.display = 'none';
      } else {
          form.style.display = 'block';
      }
  } else {
      console.log(''); 
  }
}

if (form) {
  console.log('formSettings found in the DOM on page load');
  Setbutton.addEventListener("click", OpenWindow);
} else {
  console.log('formSettings not found, waiting for it to be added');
}

const observer = new MutationObserver(function(mutationsList) {
  for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
          console.log('Mutation detected. Checking if formSettings is added...');
          form = document.getElementById("95");
          if (form) {
              console.log('formSettings has been added to the DOM');
              Setbutton.addEventListener("click", OpenWindow);
              observer.disconnect(); // Stop observing once we've bound the event
          }
      }
  }
});

// Start observing the document body for child elements being added
observer.observe(document.body, { childList: true, subtree: true });
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