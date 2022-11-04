const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var alarmSound = new Audio();
alarmSound.src = "src/chime1.wav";

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

  // TODO: update this function to clean up animation
  hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hour, 0, 12, 0, 360)}deg)`
  minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(min, 0, 60, 0, 360)}deg)`
  secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(sec, 0, 60, 0, 360)}deg)`

  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;

  let currentTime = hour + ":" + min + ":" + sec + am_pm;

  document.getElementById("digital-clock").innerHTML = currentTime;
}

showTime();



// Create Alarm Dropdowns <- Remove this
function addZero(time) {
  return (time < 10) ? "0" + time : time;
}

// Set Alarm <- What do I need to save from this function?
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

// function alarmClear() {
//   document.getElementById("alarmhrs").disabled = false;
//   document.getElementById("alarmmins").disabled = false;
//   document.getElementById("alarmsecs").disabled = false;
//   document.getElementById("ampm").disabled = false;
//   alarmSound.pause();
// }

// store the state of each time button so we can store it later
let notches = {
  timebutton1: true,
  timebutton2: false,
  timebutton3: false,
  timebutton4: false,
}
// we need to check the state of these from localstorage upon page load.

// const restoredSession = JSON.parse(localStorage.getItem('notches'));
// document.addEventListener("DOMContentLoaded", updateNotches);

// function updateNotches() {
//   notches = restoredSession
// }

const timebuttons = document.querySelectorAll(".timebutton");

function toggleTimebutton(e) {
  console.log(e.target.classList[1])
  notches[e.target.classList[1]] = !notches[e.target.classList[1]]

  // localStorage.setItem('notches', JSON.stringify(notches));
}

timebuttons.forEach(button => {
  button.addEventListener("click", toggleTimebutton)
})

// TODO update the toggle function to change the state of the buttons and notches, and eventually save the state of the buttons in localstorage

// Add toggle to Time Buttons
// TODO loop through these and add a better event listener
const timeButton1 = document.querySelector('#timebutton1')
const timeButton2 = document.querySelector('#timebutton2')
const timeButton3 = document.querySelector('#timebutton3')
const timeButton4 = document.querySelector('#timebutton4')
const zeroNotch = document.querySelector('.zero')
const fifteenNotch = document.querySelector('.fifteen')
const thirtyNotch = document.querySelector('.thirty')
const fourtyfiveNotch = document.querySelector('.fourtyfive')

// timebutton1.addEventListener('click', (e) => {
//   console.log(e.target.classList[1])
//   notches[e.target.classList[1]] = !notches[e.target.classList[1]]
// });


timebutton1.addEventListener('click', () => {
  zeroNotch.classList.toggle('active')
  timebutton1.classList.toggle('active')
  })
timebutton2.addEventListener('click', () => {
  fifteenNotch.classList.toggle('active')
  timebutton2.classList.toggle('active')
  })
timebutton3.addEventListener('click', () => {
  thirtyNotch.classList.toggle('active')
  timebutton3.classList.toggle('active')
  })
timebutton4.addEventListener('click', () => {
  fourtyfiveNotch.classList.toggle('active')
  timebutton4.classList.toggle('active')
  })

// Remind <- Just re-write all of this stuff
function timeRemind() {
  let time = new Date();
  let min = time.getMinutes();
  let sec = time.getSeconds();
  let present = min + ':' + sec
  if (timebutton1.classList.contains('active')) {
    let toggle1Time = 00 + ':' + 00;
    if (toggle1Time == present) {
    alarmSound.play();
    return
  }
  }
  if (timebutton2.classList.contains('active')) {
    let toggle2Time = 15 + ':' + 00;
    if (toggle2Time == present) {
    alarmSound.play();
    return
  }
  }
  if (timebutton3.classList.contains('active')) {
    let toggle3Time = 30 + ':' + 00;
    if (toggle3Time == present) {
    alarmSound.play();
    return
  }
  }
  if (timebutton2.classList.contains('active')) {
    let toggle4Time = 45 + ':' + 00;
    if (toggle4Time == present) {
    alarmSound.play();
    return
  }
  }
}
setInterval(timeRemind, 1000);

// reconsider how we set AM/PM previously and how we padded the zero to time, and how am_pm and ampm works?

// function addZero(time) {
//   return (time < 10) ? "0" + time : time;
// }
