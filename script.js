var alarmSound = new Audio();
alarmSound.src = "src/chime1.wav";
var alarmTimer;

// Make the Sound 1 Button Clickable to test the sound
let soundbutton1 = document.getElementById("soundbutton1");
let sound1 = document.getElementById("sound1");

soundbutton1.onclick = function () {
  alarmSound.play();
  return false;
};

// Get The Current Time and Display it
setInterval(showTime, 1000);
function showTime() {
  let time = new Date();
  let hour = time.getHours();
  let min = time.getMinutes();
  let sec = time.getSeconds();
  am_pm = "AM";

  if (hour > 12) {
    hour -= 12;
    am_pm = "PM";
  }
  if (hour == 0) {
    hr = 12;
    am_pm = "AM";
  }

  // Display Analog Clock
  const hourEl = document.querySelector('.hour')
  const minuteEl = document.querySelector('.minute')
  const secondEl = document.querySelector('.second')

  hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hour, 0, 11, 0, 360)}deg)`
  minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(min, 0, 59, 0, 360)}deg)`
  secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(sec, 0, 59, 0, 360)}deg)`


  
  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;

  let currentTime = hour + ":" + min + ":" + sec + am_pm;

  document.getElementById("digital-clock").innerHTML = currentTime;


}
const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
showTime();





// Create Alarm Dropdowns 
function addZero(time) {
  return (time < 10) ? "0" + time : time;
}

function hoursMenu(){
  var select = document.getElementById('alarmhrs');
  var hrs = 12
  
  for (i=1; i <= hrs; i++) {
    select.options[select.options.length] = new Option( i < 10 ? "0" + i : i, i);
  }
}
hoursMenu();

function minMenu(){
  var select = document.getElementById('alarmmins');
  var min = 59;

  for (i=0; i <= min; i++) {
    select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i);
  }
}
minMenu();

function secMenu(){
  var select = document.getElementById('alarmsecs');
  var sec = 59;

  for (i=0; i <= sec; i++) {
    select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i);
  }
}
secMenu();
  
// Set Alarm
function setAlarm() {
  var hr = document.getElementById('alarmhrs');
  var min = document.getElementById('alarmmins');
  var sec = document.getElementById('alarmsecs');
  var ap = document.getElementById('ampm');
  
  var selectedHour = hr.options[hr.selectedIndex].value;
  var selectedMin = min.options[min.selectedIndex].value;
  var selectedSec = sec.options[sec.selectedIndex].value;
  var selectedAP = ap.options[ap.selectedIndex].value;
  
  var alarmTime = addZero(selectedHour) + ":" + addZero(selectedMin) + ":" + addZero(selectedSec) + selectedAP;
  console.log('alarmTime:' + alarmTime);
  
  document.getElementById('alarmhrs').disabled = true;
  document.getElementById('alarmmins').disabled = true;
  document.getElementById('alarmsecs').disabled = true;
  document.getElementById('ampm').disabled = true;

  /*function to calcutate the current time 
then compare it to the alarmtime and play a sound when they are equal
*/

var h2 = document.getElementById("#digital-clock");


setInterval(function () {
  var date = new Date();
  var hours = 12 - date.getHours();
  // var hours = date.getHours();

  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = date.getHours() < 12 ? "AM" : "PM";

  //convert military time to standard time

  if (hours < 0) {
    hours = hours * -1;
  } else if (hours == 00) {
    hours = 12;
  } else {
    hours = hours;
  }
 //   document.getElementById("clock").innerHTML = currentTime;

  var currentTime = (h2.textContent =
    addZero(hours) +
    ":" +
    addZero(minutes) +
    ":" +
    addZero(seconds) +
    "" +
    ampm);

  if (alarmTime == currentTime) {
    console.log(alarmTime)
    alarmSound.play();
  }
}, 1000);

// console.log('currentTime:' + currentTime);
}

function alarmClear() {
document.getElementById("alarmhrs").disabled = false;
document.getElementById("alarmmins").disabled = false;
document.getElementById("alarmsecs").disabled = false;
document.getElementById("ampm").disabled = false;
alarmSound.pause();
}

// Add toggle to Time Buttons
const timeButtons = document.querySelectorAll('.timebutton')
const zeroNotch = document.querySelector('.zero')

timeButtons.forEach((timebutton) => {
  timebutton.addEventListener('click', () => {
    zeroNotch.classList.toggle('active')
    timebutton.classList.toggle('active')
  })
})

// Remind 
function timeRemind() {
  const timebutton1 = document.getElementById('timebutton1')
  let time = new Date();
  let min = time.getMinutes();
  if (timebutton1.classList.contains('active')) {
    let toggleTime = 00;
    if (toggleTime == min) {
    alarmSound.play();
    return 
  }
  }
}
setInterval(timeRemind, 1000);


// function addZero(time) {
//   return (time < 10) ? "0" + time : time;
// }