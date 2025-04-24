fetch('/api/userId')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById('40').innerText = 'Error: ' + data.error;
        } else {
          document.getElementById('40').innerText = "Welcome back: " + data.username;
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
              observer.disconnect();
          }
      }
  }
});

// Start observing the document body for child elements being added
observer.observe(document.body, { childList: true, subtree: true });
Setbutton.addEventListener("click", OpenWindow);
//handle form susbmit and view
function showForm(formUrl) {
  fetch(formUrl)
    .then(response => response.text())
    .then(html => {
      const container = document.getElementById('95');
      if (!container) {
        return;
      }

      container.innerHTML = html;

      const form = container.querySelector('form');
      if (!form) {
        console.error('Form not found in the loaded HTML.');
        return;
      }


      switch (form.id) {
        case 'submitPsw':
          form.addEventListener('submit', handlePasswordSubmit);
          break;
        case 'submitForm':
          form.addEventListener('submit', handleUsernameSubmit);
          break;
        case 'deleteForm':
          const deleteBtn = document.getElementById('deleteBtn');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', injectPasswordModal);
          }
          break;
        default:
          console.warn('No handler for form with ID:', form.id);
      }
    })
    .catch(error => {
      console.error('Failed to load form:', error);
    });
}
function handlePasswordSubmit(event) {
  event.preventDefault();

  const currentPassword = document.getElementById('password').value;
  const newPassword = document.getElementById('new-password').value;

  if (newPassword.length < 8) {
    alertMessage('Password must be at least 8 characters long');
    return;
  }
  if (newPassword === currentPassword) {
    alertMessage("New Password can't be the same as the current one");
    return;
  }

  const jsonData = JSON.stringify({
    currentPassword,
    newPassword
  });

  fetch('/submit-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonData
  })
  .then(async response => {
    const data = await response.json();
    alertMessage(data.message);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function handleUsernameSubmit(event) {
  event.preventDefault();

  const newUsername = document.getElementById('new-username').value;

  fetch('/submitUsername', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newUsername }),
  })
  .then(response => response.json())
  .then(data => {
    alertMessage(data.message);
    console.log(data)
    if (data.message === 'Username already exist') {
      showForm('/CUsername'); 
    }
  })
  .catch(error => console.error('Error:', error));
}



function injectPasswordModal() {
  const modal = document.createElement('div');
  modal.id = 'passwordModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';

  modal.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 300px; text-align: center;" id='container'>
      <p>Please confirm your password to delete your account:</p>
      <input type="password" id="passwordInput" placeholder="Enter your password" style="width: 100%; margin-bottom: 10px; padding: 8px;" />
      <div style="display: flex; justify-content: space-between;">
        <button id="confirmDelete" style="padding: 8px 12px;">Confirm</button>
        <button id="cancelDelete" style="padding: 8px 12px;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const removeButton = document.getElementById('cancelDelete')
  const popup = document.getElementById('container')
  console.log(removeButton)
  console.log(popup)
  removeButton.addEventListener('click', () => {
    console.log('Cancel clicked');
    popup.remove();
  });
  
  document.getElementById('confirmDelete').addEventListener('click', () => {
    const password = document.getElementById('passwordInput').value;
    fetch('/submit-delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    }).then(res => {
      modal.remove();
      if (res.ok) {
        alert('Account deleted.');
        window.location.href = '/goodbye';
      } else {
        alert('Incorrect password.');
      }
    }).catch(err => {
      console.error(err);
      alert('Something went wrong.');
    });
  });
}

