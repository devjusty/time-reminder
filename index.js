let minute, second
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

    function addZero(time){
        return (time < 10) ? "0" + time : time;
    }

    let currentTime = `${addZero(hour)}:${addZero(minute)}:${addZero(second)}${am_pm}`

    // Set up the digital clock and display the time
    const digitalClockEl = document.getElementById("digital-clock")
    digitalClockEl.innerHTML = currentTime;
}

let alarms

const restoredSession = JSON.parse(localStorage.getItem('alarms'))
if (restoredSession){
    document.addEventListener('DOMContentLoaded', restoreAlarms)
} else {
    document.addEventListener('DOMContentLoaded', defaultAlarms)
}

// if (!localStorage.getItem('alarms')){
//     console.log(JSON.parse(localStorage.getItem('alarms')))
//     alarms = {
//         alarm1: true,
//         alarm2: false,
//         alarm3: false,
//         alarm4: false,
//     }
// } else {
//     const restoredSession = JSON.parse(localStorage.getItem('alarms'))
//     console.log(restoredSession)
//     document.addEventListener('DOMContentLoaded', restoreAlarms)
// }

function restoreAlarms(){
        alarms = restoredSession
}

function defaultAlarms(){
    alarms = {
        alarm1: true,
        alarm2: false,
        alarm3: false,
        alarm4: false,
    }
}


// const alarmButtons = document.querySelectorAll('.timebutton')

function toggleAlarm(e) {
    console.log(e)
    alarms[e.target.id] = !alarms[e.target.id]
    e.target.classList.toggle('active')
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

// alarmButtons.forEach(button => {
//     button.addEventListener('click', toggleAlarm)
// })

const alarmButton1 = document.querySelector('#alarm1')
const alarmButton2 = document.querySelector('#alarm2')
const alarmButton3 = document.querySelector('#alarm3')
const alarmButton4 = document.querySelector('#alarm4')

alarmButton1.addEventListener('click', (e) => {
    toggleAlarm(e)
    document.querySelector('.zero').classList.toggle('active')
    // alarmButton1.classList.toggle('active')
})
alarmButton2.addEventListener('click', (e) => {
    document.querySelector('.fifteen').classList.toggle('active')
    // alarmButton2.classList.toggle('active')
    toggleAlarm(e)
})
alarmButton3.addEventListener('click', (e) => {
    document.querySelector('.thirty').classList.toggle('active')
    // alarmButton3.classList.toggle('active')
    toggleAlarm(e)
})
alarmButton4.addEventListener('click', (e) => {
    document.querySelector('.fourtyfive').classList.toggle('active')
    // alarmButton4.classList.toggle('active')
    toggleAlarm(e)
})

function timeReminder() {
    let present = minute + ":" + second

    var alarmSound = new Audio();
    alarmSound.src = "src/chime1.wav";

    if (alarms.alarm1) {
        if (present = 00 + ":" + 00){
            alarmSound.play()
            return
        }
    }

    if (alarms.alarm2) {
        if (present = 15 + ":" + 00){
            alarmSound.play()
            return
        }
    }

    if (alarms.alarm3) {
        if (present = 30 + ":" + 00){
            alarmSound.play()
            return
        }
    }
    if (alarms.alarm4) {
        if (present = 45 + ":" + 00){
            alarmSound.play()
            return
        }
    }
}

setInterval(timeReminder, 1000);
