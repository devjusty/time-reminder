// Create shared variables between clock and reminders
let minute, second, alarms
setInterval(getTime, 1000)

function getTime() {
    // Get the current time
    let time = new Date();
    let hour = time.getHours();
    minute = time.getMinutes();
    second = time.getSeconds();
    let am_pm = time.getHours() < 12 ? "AM" : "PM"

    if (hour > 12) {
        hour -= 12
    }
       if (hour == 0){
        hour = 12
    }

    // Set up the analog clock
    const hourEl = document.querySelector('.hour')
    const minuteEl = document.querySelector('.minute')
    const secondEl = document.querySelector('.second')
    const scale = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      }
    // Adjust the hands to the curren time
    hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hour, 0, 12, 0, 360)}deg)`
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(minute, 0, 60, 0, 360)}deg)`
    secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(second, 0, 60, 0, 360)}deg)`


    // Set up the digital clock and display the time
    let currentTime = `${addZero(hour)}:${addZero(minute)}:${addZero(second)}${am_pm}`

    const digitalClockEl = document.getElementById("digital-clock")
    digitalClockEl.innerHTML = currentTime;
}

// Utility function for adding leading zeroes
function addZero(time){
    return (time < 10) ? "0" + time : time;
}

// Restore alarms from localStorage or set defaults
const restoredSession = JSON.parse(localStorage.getItem('alarms'))
if (restoredSession){
    document.addEventListener('DOMContentLoaded', restoreAlarms)
} else {
    document.addEventListener('DOMContentLoaded', defaultAlarms)
}

// Restore settings and apply classes
function restoreAlarms(){
        alarms = restoredSession
        for(const alarm in alarms){
            if(alarms[alarm]){
                document.getElementById(alarm).classList.add('active')
            } else {
                document.getElementById(alarm).classList.remove('active')
            }
        }
        toggleNotches()
}

// Default alarms for first use
function defaultAlarms(){
    alarms = {
        alarm1: true,
        alarm2: false,
        alarm3: false,
        alarm4: false,
    }
}

// Toggle alarm function for button clicks
function toggleAlarm(e) {
    alarms[e.target.id] = !alarms[e.target.id]
    e.target.classList.toggle('active')
    localStorage.setItem('alarms', JSON.stringify(alarms));
}


const alarmButton1 = document.querySelector('#alarm1')
const alarmButton2 = document.querySelector('#alarm2')
const alarmButton3 = document.querySelector('#alarm3')
const alarmButton4 = document.querySelector('#alarm4')

// Add specific listener for each button to also toggle notch display on analog clock
alarmButton1.addEventListener('click', (e) => {
    toggleAlarm(e)
    document.querySelector('.zero').classList.toggle('active')
})
alarmButton2.addEventListener('click', (e) => {
    toggleAlarm(e)
    document.querySelector('.fifteen').classList.toggle('active')
})
alarmButton3.addEventListener('click', (e) => {
    toggleAlarm(e)
    document.querySelector('.thirty').classList.toggle('active')
})
alarmButton4.addEventListener('click', (e) => {
    toggleAlarm(e)
    document.querySelector('.fourtyfive').classList.toggle('active')
})

// Match Notch display to state of alarms from LocalStorage
function toggleNotches(){
    if (alarms.alarm1){
        document.querySelector('.zero').classList.add('active')
    } else {
        document.querySelector('.zero').classList.remove('active')
    }
    if (alarms.alarm2){
        document.querySelector('.fifteen').classList.add('active')
    } else {
        document.querySelector('.fifteen').classList.remove('active')
    }
    if (alarms.alarm3){
        document.querySelector('.thirty').classList.add('active')
    } else {
        document.querySelector('.thirty').classList.remove('remove')
    }
    if (alarms.alarm4){
        document.querySelector('.fourtyfive').classList.add('active')
    } else {
        document.querySelector('.fourtyfive').classList.remove('active')
    }
}
// TODO: Refactor above event listeners and functions

// Function to run the active reminders
function timeReminder() {
    let present = addZero(minute) + ":" + addZero(second)

    var alarmSound = new Audio();
    alarmSound.src = "src/chime1.wav";

    // TODO: Refactor this code so it doesn't repeat
    if (alarms.alarm1) {
        if (present == "00:00"){
            alarmSound.play()
            return
        }
    }

    if (alarms.alarm2) {
        if (present == "15:00"){
            alarmSound.play()
            return
        }
    }

    if (alarms.alarm3) {
        if (present == "30:00"){
            alarmSound.play()
            return
        }
    }
    if (alarms.alarm4) {
        if (present == "45:00"){
            alarmSound.play()
            return
        }
    }
}

setInterval(timeReminder, 1000);
