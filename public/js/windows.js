var CreateLog = document.getElementsByClassName('adition');
var CloseTab = document.getElementsByClassName('close');
var CloseTab2 = document.getElementsByClassName('close2');
const Log = document.getElementsByClassName('LogEntry');
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
function OpenWindow() {
    openLogEntryAnimation();
    overlay.style.display = 'block';
}
function CloseWIndow(){
    closeLogEntryAnimation()
}
function CloseRead(){
    closeAnimation()
}
for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function() {
        for (var i = 0; i < Log.length; i++) {
            read[i].style.display = 'block';
        }
        overlay.style.display = 'block';
    });
}
function closeAnimation() {
    const reader = document.querySelector('.reader');
    DisplayHidden()
    reader.animate(
      [
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' }
      ],
      { duration: 320, easing: 'ease-in-out' }
    ).onfinish = () => {
      reader.style.display = 'none';
    };
  }

function closeLogEntryAnimation() {
    const Log = document.querySelector('.LogEntry');
    DisplayHidden()
        Log.animate(
            [
                { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }, 
                { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' } 
            ],
            {
                duration: 300, 
                easing: 'ease-in-out', 
                fill: 'forwards'
            }
        ).onfinish = function() {
            Log.style.display = 'none';
            displayer.style.display = 'none'
        };
    }



  function openLogEntryAnimation() {
    const log = document.querySelector('.LogEntry');
    console.log(log)
    log.style.display = 'block';
    log.animate(
      [
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' } 
      ],
      { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
    );
    DisplayVisible()
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

function DisplayVisible(){
    displayer.animate(
        [
          {opacity: 0},
          {opacity: 1}
        ],
        {duration: 320, easing: 'ease-in-out'}
      )     
}


function DisplayHidden(){
    const displayer = document.querySelector('.overlay')
    displayer.animate(
        [
          {opacity: 1},
          {opacity: 0}
        ],
        {duration: 320, easing: 'ease-out'}
      ).onfinish = function() {
        displayer.style.display = 'none'; 
    };
}


