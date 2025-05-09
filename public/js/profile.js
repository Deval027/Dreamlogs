
let popup = document.getElementById('modalOverlay')
let cancelDelete = document.getElementById('cancelDelete')
let submitdelete = document.getElementById('confirmDelete')
fetch('/api/userId')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById('40').innerText = 'Error: ' + data.error;
        } else {
          document.getElementById('40').innerText = "Hello: " + data.username;
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
var form = document.getElementById("form-container")

const observer = new MutationObserver(function(mutationsList) {
  for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
          form = document.getElementById("95");
          if (form) {
              observer.disconnect();
          }
      }
  }
});

// Start observing the document body for child elements being added
observer.observe(document.body, { childList: true, subtree: true });
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

      //dinamic view depending on form selected switch for each of three settings
      switch (form.id) {
        case 'submitPsw':
          form.addEventListener('submit', handlePasswordSubmit);
          break;

        case 'submitForm':
          form.addEventListener('submit', handleUsernameSubmit);
          break;

        case 'deleteForm':
            deleteBtn.addEventListener('click', () => {
              showModal()
            });
            cancelDelete.addEventListener('click',() => {
              closeModal()
            })
            submitdelete.addEventListener('click', () =>{
              let password = document.getElementById('passwordInput').value;
              handleDeleteSubmit(password)
            })
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
    if (data.message === 'Username already exist') {
      showForm('/CUsername'); 
    }
  })
  .catch(error => console.error('Error:', error));
}



function handleDeleteSubmit(passwordIn) {
  fetch('/submit-delete-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: passwordIn })
  }).then(res => {
    if (res.ok) {
      alert('Account deleted.');
      window.location.href = '/goodbye';
    } else {
      alertMessage('Incorrect password.');
    }
  }).catch(err => {
    console.error(err);
    alert('Something went wrong.');
  });
}

function showModal(){
  const children = popup.children;
  popup.style.display = 'block'
}

function closeModal(){
  popup.style.display = 'none'
}