let overlay = document.getElementById('overlay'); 

fetch('/api/dreams') 
  .then(response => response.json())
  .then(dreams => {
    const mainDiv = document.getElementById('main');
    dreams.forEach(dream => {
      const button = document.createElement('button');
      button.className = 'box';
      button.id = dream.dreamid;  

      const nameSpan = document.createElement('span');
      nameSpan.className = 'left_top';
      nameSpan.textContent = 'Dream name: ' + dream.dream_name;
      button.appendChild(nameSpan);

      const dateSpan = document.createElement('span');
      dateSpan.className = 'right_top';
      dateSpan.textContent = 'Date: ' + new Date(dream.date).toISOString().slice(0, 10);
      button.appendChild(dateSpan);

      const typeSpan = document.createElement('span');
      typeSpan.className = 'left_bottom';
      typeSpan.textContent = 'Type of dream: ' + dream.type_of_dream;
      button.appendChild(typeSpan);

      const claritySpan = document.createElement('span');
      claritySpan.className = 'right_bottom';
      claritySpan.textContent = 'Clarity: ' + dream.clarity;
      button.appendChild(claritySpan);

      mainDiv.appendChild(button);

      button.addEventListener('click', function() {
        
        const descriptionElement = document.querySelector('.definition .content');
        
        descriptionElement.textContent = dream.description;

        const readerbutton = document.getElementsByClassName('reader')[0]; 

        if (!readerbutton.querySelector('.delete-button')) {
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-button';
          deleteButton.textContent = 'Delete';

          readerbutton.appendChild(deleteButton);

          deleteButton.addEventListener('click', deleteWindow);

          function deleteWindow() {
            for (let i = 0; i < read.length; i++) {
              read[i].style.display = 'none';
            }
            overlay.style.display = 'none';
          }
        }
        for (let i = 0; i < boxes.length; i++) {
          boxes[i].addEventListener('click', function() {
            for (let i = 0; i < Log.length; i++) {
              read[i].style.display = 'block';
            }
            overlay.style.display = 'block';
          });
        }
        const deleteButton = readerbutton.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
          fetch(`/api/deleteDream/${dream.dreamid}`, { 
            method: 'DELETE',
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            mainDiv.removeChild(button);
          })
          .catch(error => console.error('Error:', error));
        });

        for (let i = 0; i < Log.length; i++) {
          read[i].style.display = 'block';
        }
        overlay.style.display = 'block';
      });
    });
  })
  .catch(error => console.error('Error:', error));

  