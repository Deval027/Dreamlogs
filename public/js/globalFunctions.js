function alertMessage(message){
    const existingBox = document.getElementById('errorBox');
      if (existingBox) existingBox.remove();
        const box = document.createElement('div');
        box.id = 'errorBox';
        box.textContent = message;
        document.body.appendChild(box);
        const progress = document.createElement('div');
        progress.id = 'errorProgress';
  
        box.appendChild(progress);
        document.body.appendChild(box);
  
        progress.addEventListener('animationend', () => {
          box.remove();
        });
  }
  
  let errorMessage = '';



  