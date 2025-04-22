function alertMessage(message){
    const existingBox = document.getElementById('errorBox');
      if (existingBox) existingBox.remove();
        const box = document.createElement('div');
        box.id = 'errorBox';
        box.textContent = errorMessage;
        document.body.appendChild(box);
        const progress = document.createElement('div');
        progress.id = 'errorProgress';
  
        // Append progress to box
        box.appendChild(progress);
        document.body.appendChild(box);
  
        // Remove the box when animation ends
        progress.addEventListener('animationend', () => {
          box.remove();
        });
  }

let errorMessage = ''
const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.action === 'reload') {
        alert(data.message);
        location.reload();
    }
};

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    
    const loginData = {};
    formData.forEach((value, key) => {
        loginData[key] = value;
    });

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    });

    const result = await response.json(); 

    if (result.success) {
        window.location.href = result.redirect; 
    } else {
        errorMessage = 'Username or password invalid'
        alertMessage(errorMessage)
       // location.reload(); 
    }
});
