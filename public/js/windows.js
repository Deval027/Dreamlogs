
var CreateLog = document.getElementsByClassName('adition');
var CloseTab = document.getElementsByClassName('close');
var Log = document.getElementsByClassName('LogEntry');
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
        Log[i].style.display = 'none';
    }
    overlay.style.display = 'none';
}
CreateLog[0].addEventListener("click", OpenWindow);
CloseTab[0].addEventListener("click", CloseWIndow);
