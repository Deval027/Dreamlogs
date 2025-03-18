var CreateLog = document.getElementsByClassName('adition');
var CloseTab = document.getElementsByClassName('close');
var CloseTab2 = document.getElementsByClassName('close2');
var Log = document.getElementsByClassName('LogEntry');
var read = document.getElementsByClassName('reader');
var boxes = document.getElementsByClassName('box');
var deleteButtons = document.getElementsByClassName('delete-button');
for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function() {
    const box = this.parentElement; // Get the box button from the delete button
    let dreamId = document.getElementById('id');
    deleteDream(box.id); // Get the dream id from the box button's id
    console.log('dreamId:', dreamId);
  });
}
function OpenWindow() {
    console.log("openm")
    for (var i = 0; i < Log.length; i++) {
        Log[i].style.display = 'block';
    }
    overlay.style.display = 'block';


}
function CloseWIndow(){
    console.log("open")
   for (var i = 0; i < Log.length; i++) {
        Log[i].style.display = 'none' ;
    }
    overlay.style.display = 'none';
}
function CloseRead(){
    closeReader()
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
function closeReader() {
    read.animate(
      [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.9)' }
      ],
      { duration: 300, easing: 'ease-in-out' }
    ).onfinish = () => {
      read.style.display = 'none'; 
    };
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

