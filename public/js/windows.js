var CreateLog = document.getElementsByClassName('adition');
var CloseTab = document.getElementsByClassName('close');
var CloseTab2 = document.getElementsByClassName('close2');
var Log = document.getElementsByClassName('LogEntry');
var read = document.getElementsByClassName('reader');
var boxes = document.getElementsByClassName('box');
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

