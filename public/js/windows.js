

var CreateLog = document.getElementsByClassName('adition');
var CloseTab = document.getElementsByClassName('close');
var CloseTab2 = document.getElementsByClassName('close2');
var Log = document.getElementsByClassName('LogEntry');
var read = document.getElementsByClassName('reader');
var boxes = document.getElementsByClassName('box');
var deleteButtons = document.getElementsByClassName('delete');
for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function() {
    const box = this.parentElement; // Get the box button from the delete button
    let dreamId = document.getElementById('id');
    deleteDream(box.id); // Get the dream id from the box button's id
    console.log('dreamId:', dreamId);
  });
}

function deleteDream(dreamId) {
  // Send a DELETE request to the server
  fetch(`/api/deleteDream/${dreamId}`, { // replace with your DELETE endpoint
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Hide the box
    const box = document.getElementById(dreamId);
    if (box) {
      box.style.display = 'none';
    }
  })
  .catch(error => console.error('Error:', error));
}
function OpenWindow() {
    // Loop through all Log elements and make them visible
    for (var i = 0; i < Log.length; i++) {
        Log[i].style.display = 'block';
    }
    overlay.style.display = 'block';


}
function CloseWIndow(){
    // Loop through all Log elements and make them visible
   for (var i = 0; i < Log.length; i++) {
        Log[i].style.display = 'none' ;
    }
    overlay.style.display = 'none';
}
function CloseRead(){
    for (let i = 0; i < read.length; i++) {
        read[i].style.display = 'none';
    }
    overlay.style.display = 'none';
}
for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function() {
        for (var i = 0; i < Log.length; i++) {
            read[i].style.display = 'block';
        }
        overlay.style.display = 'block';
    });
}
CreateLog[0].addEventListener("click", OpenWindow);
CloseTab[0].addEventListener("click", CloseWIndow);
CloseTab2[0].addEventListener("click", CloseRead);

