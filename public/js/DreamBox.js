
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

      // **Click event for opening dream reader**
      button.addEventListener('click', function() {
        console.log("Open")
        openReader()
        const descriptionElement = document.querySelector('.definition .content');
        const readerbutton = document.getElementsByClassName('reader')[0];
        const readerTitle = document.querySelector('.reader .title');
        readerTitle.textContent = dream.dream_name;
        // Assign the dream ID
        readerbutton.dataset.dreamId = dream.dreamid;
        descriptionElement.textContent = dream.description;

        // Remove existing delete button (if any)
        let existingDeleteButton = readerbutton.querySelector('.delete-button');
        if (existingDeleteButton) {
          existingDeleteButton.remove();
        }

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.dreamId = dream.dreamid;

        // **Click event for deleting the dream**
        deleteButton.addEventListener('click', function() {
          const dreamIdToDelete = deleteButton.dataset.dreamId;
          
          fetch(`/api/deleteDream/${dreamIdToDelete}`, { method: 'DELETE' })
            .then(response => {
              if (response.ok) {
                console.log(`Deleted dream with ID: ${dreamIdToDelete}`);
                
                // Hide reader box
                readerbutton.style.display = 'none';

                // Remove dream box from main container
                const dreamBox = document.getElementById(dreamIdToDelete);
                if (dreamBox) {
                  dreamBox.remove();
                }
              } else {
                console.error('Failed to delete dream.');
              }
            })
            .catch(error => console.error('Error:', error));
        });

        // Append delete button to the reader
        readerbutton.appendChild(deleteButton);

        // Show the reader
        readerbutton.style.display = 'flex';
      });
    });
  })
  .catch(error => console.error('Error fetching dreams:', error));


       
        




function deleteWindow() {
  for (let i = 0; i < read.length; i++) {
    read[i].style.display = 'none';
  }
  overlay.style.display = 'none';
}



function openReader() {
  const reader = document.querySelector('.reader');
  const displayer = document.querySelector('.overlay')
  reader.style.display = 'flex'; // Make it visible before animating
  displayer.style.display = "block"
  reader.animate(
    [
      { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' }, // Start small but centered
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' } // Grow while staying centered
    ],
    { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
  );
}
