function alertMessage(message){
    const existingBox = document.getElementById('errorBox');
    console.log('hi')
      if (existingBox) existingBox.remove();
        const box = document.createElement('div');
        box.id = 'errorBox';
        box.textContent = message;
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
  
  let errorMessage = '';