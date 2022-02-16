var alarmSound = new Audio();
alarmSound.src = "src/chime1.wav";
var alarmTimer;

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

  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;

  let currentTime = hour + ":" + min + ":" + sec + am_pm;

  document.getElementById("clock").innerHTML = currentTime;
}

showTime();

// Make the Sound 1 Button Clickable to test the sound
let soundbutton1 = document.getElementById("soundbutton1");
let sound1 = document.getElementById("sound1");

soundbutton1.onclick = function () {
  console.log("play");
  alarmSound.play();
  return false;
};

// Set Alarm
function setAlarm(button) {
  let ms = document.getElementById("alarmTime").valueAsNumber;
  if (isNaN(ms)) {
    alert("Invalid Date");
    return;
  }

  let alarm = new Date(ms);
  let alarmTime = new Date(
    alarm.getUTCFullYear(),
    alarm.getUTCMonth(),
    alarm.getUTCDate(),
    alarm.getUTCHours(),
    alarm.getUTCMinutes(),
    alarm.getUTCSeconds()
  );
  let differenceInMs = alarmTime.getTime() - new Date().getTime();

  if (differenceInMs < 0) {
    alert("Specified time is already passed!");
    return;
  }

  alarmTimer = setTimeout(initAlarm, differenceInMs);

  button.innerText = "Cancel Alarm";
  button.setAttribute("onclick", "cancelAlarm(this);");
}

function cancelAlarm(button) {
  button.innerText = "Set Alarm";
  button.setAttribute = ("onclick", "setAlarm(this);");
  clearTimeout(alarmTimer);
}

function initAlarm() {
  alarmSound.play();
  document.getElementById("alarmOptions").style.display = "";
}

function stopAlarm() {
  alarmSound.pause();
  alarmSound.currenTime = 0;
  document.getElementById("alarmOptions").style.display = "none";
  cancelAlarm(document.getElementById("alarmButton"));
}

function snooze() {
  stopAlarm();
  setTimeout(initAlarm, 36000);
}