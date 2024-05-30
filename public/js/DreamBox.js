
let overlay = document.getElementById('overlay'); // replace 'overlay' with the id of your overlay div

fetch('/api/dreams') // replace with your GET endpoint
  .then(response => response.json())
  .then(dreams => {
    const mainDiv = document.getElementById('main'); // replace 'main' with the id of your div

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
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      if (!readerbutton.querySelector('.delete-button')) {
        readerbutton.appendChild(deleteButton);
    }
   
        // Add an event listener to the delete button
        deleteButton.addEventListener('click', function() {
          fetch(`/api/deleteDream/${dream.dreamid}`, { // replace with your DELETE endpoint
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

        for (var i = 0; i < Log.length; i++) {
          read[i].style.display = 'block';
        }
        overlay.style.display = 'block';
      });
    });
  })
  .catch(error => console.error('Error:', error));