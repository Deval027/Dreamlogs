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
          const descriptionElement = readerbutton.querySelector('.content');
          const currentDescription = descriptionElement.textContent;

          const textarea = document.createElement('textarea');
          textarea.value = currentDescription;
          textarea.className = 'editor';
          textarea.value = currentDescription;
          textarea.rows = 40;
          textarea.className = 'editor';
          descriptionElement.replaceWith(textarea);
        
          deleteButton.remove();
          editButton.remove();

        
          const saveButton = document.createElement('button');
          saveButton.textContent = 'Save';
          saveButton.className = 'save-button';

          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancel';
          cancelButton.className = 'cancel-button';

          saveButton.addEventListener('click', function () {
            const updatedDescription = textarea.value;
        
            fetch(`/api/updateDream/${dream.dreamid}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ description: updatedDescription }),
            })
              .then(response => {
                if (response.ok) {
                  const newSpan = document.createElement('span');
                  newSpan.className = 'content';
                  newSpan.textContent = updatedDescription;
                  textarea.replaceWith(newSpan);
      
                  readerbutton.appendChild(deleteButton);
                  readerbutton.appendChild(editButton);
                } else {
                  console.error('Failed to update dream.');
                }
              })
              .catch(error => console.error('Error:', error));
          });
        
          cancelButton.addEventListener('click', function () {
            const originalSpan = document.createElement('span');
            originalSpan.className = 'content';
            originalSpan.textContent = currentDescription;
            textarea.replaceWith(originalSpan);
        
            readerbutton.appendChild(deleteButton);
            readerbutton.appendChild(editButton);
            saveButton.remove()
            cancelButton.remove()
          });
          CloseTab2[0].addEventListener('click', function () {
            const originalSpan = document.createElement('span');
            originalSpan.className = 'content';
            originalSpan.textContent = currentDescription;
            textarea.replaceWith(originalSpan);
        
            saveButton.remove()
            cancelButton.remove()
          });
          
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
