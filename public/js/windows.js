var CreateLog = document.getElementsByClassName('adition');
var CloseTab = document.getElementsByClassName('close');
var CloseTab2 = document.getElementsByClassName('close2');
var Log = document.getElementsByClassName('LogEntry');
var read = document.getElementsByClassName('reader');
var boxes = document.getElementsByClassName('box');
var deleteButtons = document.getElementsByClassName('delete-button');
for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function() {
    const box = this.parentElement; 
    let dreamId = document.getElementById('id');
    deleteDream(box.id); 
    console.log('dreamId:', dreamId);
  });
}

function deleteDream(dreamId) {
  fetch(`/api/deleteDream/${dreamId}`, { 
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const box = document.getElementById(dreamId);
    if (box) {
      box.style.display = 'none';
    }
  })
  .catch(error => console.error('Error:', error));
}
function OpenWindow() {

    for (var i = 0; i < Log.length; i++) {
        Log[i].style.display = 'block';
    }
    overlay.style.display = 'block';
}
function CloseWIndow(){
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

function deleteWindow(){
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

