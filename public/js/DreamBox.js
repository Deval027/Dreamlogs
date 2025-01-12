<<<<<<< HEAD
let overlay = document.getElementById('overlay'); // Replace 'overlay' with the id of your overlay div

fetch('/api/dreams') // Replace with your GET endpoint
  .then(response => response.json())
  .then(dreams => {
    const mainDiv = document.getElementById('main'); // Replace 'main' with the id of your div

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
        // Find the description element
        const descriptionElement = document.querySelector('.definition .content');
        // Set the text content of the description element to the description of the dream
        descriptionElement.textContent = dream.description;

        const readerbutton = document.getElementsByClassName('reader')[0]; // Get the first element with the class 'reader'

        // Check if a delete button already exists inside the readerbutton
        if (!readerbutton.querySelector('.delete-button')) {
          // Create the delete button
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-button';
          deleteButton.textContent = 'Delete';

          // Append the delete button to the readerbutton element
          readerbutton.appendChild(deleteButton);

          // Add event listener to the delete button
          deleteButton.addEventListener('click', deleteWindow);

          function deleteWindow() {
            for (let i = 0; i < read.length; i++) {
              read[i].style.display = 'none';
            }
            overlay.style.display = 'none';
          }
        }

        // Add event listeners to box elements
        for (let i = 0; i < boxes.length; i++) {
          boxes[i].addEventListener('click', function() {
            for (let i = 0; i < Log.length; i++) {
              read[i].style.display = 'block';
            }
            overlay.style.display = 'block';
          });
        }

        // Add an event listener to the delete button
        const deleteButton = readerbutton.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
          fetch(`/api/deleteDream/${dream.dreamid}`, { // Replace with your DELETE endpoint
            method: 'DELETE',
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            // Remove the dream button from the DOM
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
=======
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

  
>>>>>>> origin/main
