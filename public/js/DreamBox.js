fetch('/api/dreams') // replace with your GET endpoint
  .then(response => response.json())
  .then(data => {
    const mainDiv = document.getElementById('main'); // replace 'main' with the id of your div

    data.forEach(dream => {
      const button = document.createElement('button');
      button.className = 'box';
      button.id = dream.dreamid;  
      const nameSpan = document.createElement('span');
      nameSpan.className = 'left_top';
      nameSpan.textContent = 'Dream name: ' + dream.NameInput;
      button.appendChild(nameSpan);

      const dateSpan = document.createElement('span');
      dateSpan.className = 'right_top';
      dateSpan.textContent = 'Date: ' + dream.date;
      button.appendChild(dateSpan);

      const typeSpan = document.createElement('span');
      typeSpan.className = 'left_bottom';
      typeSpan.textContent = 'Type of dream: ' + dream.typeD;
      button.appendChild(typeSpan);

      const claritySpan = document.createElement('span');
      claritySpan.className = 'right_bottom';
      claritySpan.textContent = 'Clarity: ' + dream.clarity;
      button.appendChild(claritySpan);

      mainDiv.appendChild(button);
    });
  })
  .catch(error => console.error('Error:', error));