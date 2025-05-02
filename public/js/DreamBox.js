const displayer = document.querySelector('.overlay')
fetch('/api/dreams') 
  .then(response => response.json())
  .then(dreams => {
    const mainDiv = document.getElementById('main'); 

    dreams.forEach(dream => {
      var brtitle = document.createElement("br")
      var brdate = document.createElement("br")
      const button = document.createElement('button');
      button.className = 'box';
      button.id = dream.dreamid;  

      const dateSpan = document.createElement('span');
      dateSpan.className = 'date';
      dateSpan.textContent = new Date(dream.date).toISOString().slice(0, 10);
      button.appendChild(dateSpan);
      button.appendChild(brdate);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = dream.dream_name;
      button.appendChild(nameSpan);
      button.appendChild(brtitle);

      const typeSpan = document.createElement('span');
      typeSpan.className = 'typo';
      typeSpan.textContent = dream.type_of_dream;
      button.appendChild(typeSpan);

      mainDiv.appendChild(button);

      // Click event for opening dream reader
      button.addEventListener('click', function() {
        openReader()
        const descriptionElement = document.querySelector('.definition .content');
        const readerbutton = document.getElementsByClassName('reader')[0];
        const readerTitle = document.querySelector('.reader .title');
        readerTitle.textContent = dream.dream_name;
        // Assign the dream ID
        readerbutton.dataset.dreamId = dream.dreamid;
        descriptionElement.textContent = dream.description;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.dreamId = dream.dreamid;

        const editButton = document.createElement('button');
        editButton.className = 'editButton';
        editButton.textContent = 'Edit';
        editButton.dataset.dreamId = dream.dreamid;

         // Remove existing delete button (if any)
         let existingDeleteButton = readerbutton.querySelector('.delete-button');
         if (existingDeleteButton) {
           existingDeleteButton.remove();
         }
 
 
         let existingEditButton = readerbutton.querySelector('.editButton');
         if (existingEditButton) {
           existingEditButton.remove();
         }
         
        // Click event for deleting the dream
        deleteButton.addEventListener('click', function() {
          const dreamIdToDelete = deleteButton.dataset.dreamId;
          
          fetch(`/api/deleteDream/${dreamIdToDelete}`, { method: 'DELETE' })
            .then(response => {
              if (response.ok) {
                readerbutton.style.display = 'none';
                const dreamBox = document.getElementById(dreamIdToDelete);
                if (dreamBox) {
                  dreamBox.remove();
                  HideOverlay()
                }
              } else {
                console.error('Failed to delete dream.');
              }
            })
            .catch(error => console.error('Error:', error));
        });
        //edit listener
        editButton.addEventListener('click', function () {
          // Step 1: Replace span with textarea
          const descriptionElement = readerbutton.querySelector('.content');
          const currentDescription = descriptionElement.textContent;

          const textarea = document.createElement('textarea');
          textarea.value = currentDescription;
          textarea.className = 'editor';
          textarea.value = currentDescription;
          textarea.className = 'editor';
          textarea.rows = 10; 
          textarea.style.width = '100%'; // makes it full width
          descriptionElement.replaceWith(textarea);
        
          // Step 2: Remove existing buttons
          deleteButton.remove();
          editButton.remove();

        
          // Step 3: Create Save button
          const saveButton = document.createElement('button');
          saveButton.textContent = 'Save';
          saveButton.className = 'save-button';
        
          // Step 4: Create Cancel button
          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancel';
          cancelButton.className = 'cancel-button';
        
          // Step 5: Save handler
          saveButton.addEventListener('click', function () {
            const updatedDescription = textarea.value;
        
            fetch(`/api/updateDream/${dream.dreamid}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ description: updatedDescription }),
            })
              .then(response => {
                if (response.ok) {
                  // Replace textarea with updated span
                  const newSpan = document.createElement('span');
                  newSpan.className = 'content';
                  newSpan.textContent = updatedDescription;
                  textarea.replaceWith(newSpan);
        
                  // Re-append Edit and Delete buttons
                  readerbutton.appendChild(deleteButton);
                  readerbutton.appendChild(editButton);
                } else {
                  console.error('Failed to update dream.');
                }
              })
              .catch(error => console.error('Error:', error));
          });
        
          // Step 6: Cancel handler
          cancelButton.addEventListener('click', function () {
            // Restore original span
            const originalSpan = document.createElement('span');
            originalSpan.className = 'content';
            originalSpan.textContent = currentDescription;
            textarea.replaceWith(originalSpan);
        
            // Re-append Edit and Delete buttons
            readerbutton.appendChild(deleteButton);
            readerbutton.appendChild(editButton);
            saveButton.remove()
            cancelButton.remove()
          });
          CloseTab2[0].addEventListener('click', function () {
            // Restore original span
            const originalSpan = document.createElement('span');
            originalSpan.className = 'content';
            originalSpan.textContent = currentDescription;
            textarea.replaceWith(originalSpan);
        
            // Re-append Edit and Delete buttons
            saveButton.remove()
            cancelButton.remove()
          });
          
        
          // Step 7: Append Save and Cancel buttons
          readerbutton.appendChild(saveButton);
          readerbutton.appendChild(cancelButton);
        });
        
        readerbutton.appendChild(deleteButton);
        readerbutton.appendChild(editButton)
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
  reader.style.display = 'flex'; 
  displayer.style.display = "block"
  reader.animate(
    [
      { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' }, 
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' } 
    ],
    { duration: 320, easing: 'ease-in-out', fill: 'forwards' }
  );
  displayer.animate(
    [
      {opacity: 0},
      {opacity: 1}
    ],
    {duration: 320, easing: 'ease-in-out'}
  )
}
function HideOverlay(){
  displayer.style.display = "none"
}
