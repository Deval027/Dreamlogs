let dreams = [];

fetch('/api/dreams') // replace with your GET endpoint
  .then(response => response.json())
  .then(dream => {
    dreams = dream.dreams;
    console.log(dream);
    const mainDiv = document.getElementById('main'); // replace 'main' with the id of your div
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
      // Display the description of the dream in the span
      const contentSpan = document.querySelector('.definition .content');
      contentSpan.textContent = dream.description;

      for (var i = 0; i < Log.length; i++) {
        read[i].style.display = 'block';
      }
      overlay.style.display = 'block';
    });
  })
  .catch(error => console.error('Error:', error));
