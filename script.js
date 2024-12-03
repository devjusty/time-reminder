// Shared variables for clock and reminders
let minute, second, alarms;
let remindUntil = {
  time: "17:00", // Default to 5:00 PM
  enabled: false,
};
let lastTriggeredMinute = null;

document.addEventListener("DOMContentLoaded", () => {
  initializeAlarms();
  getTime();
  initializeRemindUntil();
});

// Update the time every second
setInterval(getTime, 1000);

const alarmSound = new Audio("src/chime1.wav");
const endSound = new Audio("src/double-chime.wav");

// Utility function for scaling values (e.g., for clock rotation)
const scale = (num, in_min, in_max, out_min, out_max) =>
  ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;

function getTime() {
  // Get the current time
  const now = new Date();
  let hour = now.getHours();
  minute = now.getMinutes();
  second = now.getSeconds();
  const am_pm = hour < 12 ? "AM" : "PM";

  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  // Update the analog clock
  const hourEl = document.querySelector(".needle.hour");
  const minuteEl = document.querySelector(".needle.minute");
  const secondEl = document.querySelector(".needle.second");

  if (hourEl)
    hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(
      hour,
      0,
      12,
      0,
      360
    )}deg)`;
  if (minuteEl)
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(
      minute,
      0,
      60,
      0,
      360
    )}deg)`;
  if (secondEl)
    secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(
      second,
      0,
      60,
      0,
      360
    )}deg)`;

  // Update the digital clock
  const currentTime = `${addZero(hour)}:${addZero(minute)} ${am_pm}`;
  const digitalClockEl = document.getElementById("digital-clock");
  if (digitalClockEl) digitalClockEl.innerHTML = currentTime;

  checkRemindUntil();
  timeReminder();
}

// Add leading zeroes for time values
const addZero = (time) => (time < 10 ? "0" + time : time);

// Initialize alarm settings
function initializeAlarms() {
  const restoredSession = loadFromLocalStorage("alarms");
  alarms = restoredSession || {
    alarm1: true,
    alarm2: false,
    alarm3: false,
    alarm4: false,
  };

  // Ensure all expected alarm keys are present
  ["alarm1", "alarm2", "alarm3", "alarm4"].forEach((key) => {
    if (!(key in alarms)) alarms[key] = false;
  });

  saveAlarms();
  restoreAlarms();
}

// Save alarms to localStorage
function saveAlarms() {
  saveToLocalStorage("alarms", alarms);
}

// Restore alarm states to the UI
function restoreAlarms() {
  for (const alarm in alarms) {
    const button = document.getElementById(alarm);
    if (button) {
      button.classList.toggle("active", alarms[alarm]);
    }
  }
  toggleNotches();
}

// Toggle alarm state when a button is clicked
function toggleAlarm(e) {
  const alarmId = e.target.id;
  if (alarms[alarmId] !== undefined) {
    alarms[alarmId] = !alarms[alarmId];
    e.target.classList.toggle("active");
    saveAlarms();
    toggleNotches();
  }
}

// Add event listeners to alarm buttons dynamically
["alarm1", "alarm2", "alarm3", "alarm4"].forEach((alarmId) => {
  const button = document.querySelector(`#${alarmId}`);
  if (button) {
    button.addEventListener("click", toggleAlarm);
  }
});

// Update notches on the analog clock based on alarms
function toggleNotches() {
  const classNames = ["zero", "fifteen", "thirty", "fourtyfive"];
  classNames.forEach((className, index) => {
    const notch = document.querySelector(`.${className}`);
    const alarmKey = `alarm${index + 1}`;
    if (notch) {
      notch.classList.toggle("active", alarms[alarmKey]);
    }
  });
}

// Initialize the "Remind Until" feature
function initializeRemindUntil() {
  const savedRemindUntil = loadFromLocalStorage("remindUntil");
  if (savedRemindUntil) {
    remindUntil = savedRemindUntil; // Overwrite remindUntil with saved data
    const remindUntilInput = document.getElementById("remind-until");
    const remindUntilToggle = document.getElementById("remind-until-toggle");
    if (remindUntilInput) remindUntilInput.value = savedRemindUntil.time;
    if (remindUntilToggle) remindUntilToggle.checked = savedRemindUntil.enabled;
  }
}

const remindUntilInput = document.getElementById("remind-until");
const remindUntilToggle = document.getElementById("remind-until-toggle");

if (remindUntilInput) {
  remindUntilInput.value = remindUntil.time;
  remindUntilInput.addEventListener("change", (e) => {
    remindUntil.time = e.target.value;
    saveRemindUntil();
  });
}

if (remindUntilToggle) {
  remindUntilToggle.checked = remindUntil.enabled;
  remindUntilToggle.addEventListener("change", (e) => {
    remindUntil.enabled = e.target.checked;
    saveRemindUntil();
  });
}

// Save "Remind Until" settings to localStorage
function saveRemindUntil() {
  saveToLocalStorage("remindUntil", remindUntil);
}

// Check and handle "Remind Until" functionality
function checkRemindUntil() {
  if (!remindUntil.enabled) return;

  const now = new Date();
  const hour = now.getHours();
  const currentTime = `${addZero(hour)}:${addZero(minute)}`;

  if (currentTime === remindUntil.time) {
    Object.keys(alarms).forEach((alarmId) => {
      alarms[alarmId] = false;
    });
    saveAlarms();
    restoreAlarms();
    endSound.play();
    remindUntil.enabled = false;
    if (remindUntilToggle) remindUntilToggle.checked = false;
    saveRemindUntil();

    // Trigger the clock glow effect
    const clock = document.querySelector(".clock");
    if (clock) {
      clock.classList.add("alert");
      setTimeout(() => {
        clock.classList.remove("alert");
      }, 3000);
    } else {
      console.error(".clock element not found in the DOM!");
    }
  }
}

// Play reminders as activated
function timeReminder() {
  const reminderTimes = ["00", "15", "30", "45"];
  const currentMinute = addZero(minute);

  console.log("Current minute:", currentMinute);
  console.log("Last triggered minute:", lastTriggeredMinute);

  // Skip processing if already triggered for this minute
  if (lastTriggeredMinute === currentMinute) {
    console.log("Skipping, already triggered for this minute.");
    return;
  }

  // Process reminders
  let alarmTriggered = false;
  reminderTimes.forEach((time, index) => {
    const alarmKey = `alarm${index + 1}`;
    console.log(`Checking ${alarmKey} for ${time}:`, alarms[alarmKey]);

    if (alarms && alarms[alarmKey] && currentMinute === time) {
      console.log(`Playing alarm for ${alarmKey} at ${currentMinute}`);
      alarmSound.play();
      alarmTriggered = true;

      // Trigger combined visual effect
      const clock = document.querySelector(".clock");
      if (clock) {
        console.log("Adding alert class to .clock");
        clock.classList.add("alert");
        setTimeout(() => {
          console.log("Removing alert class from .clock");
          clock.classList.remove("alert"); // Remove effect after 3 seconds
        }, 3000);
      } else {
        console.error(".clock element not found in the DOM!");
      }
    }
  });

  // Update lastTriggeredMinute only if an alarm was triggered
  if (alarmTriggered) {
    lastTriggeredMinute = currentMinute;
    console.log("Updating lastTriggeredMinute:", lastTriggeredMinute);
  }
}

// Save data to localStorage with error handling
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error.message}`);
  }
}

// Load data from localStorage with error handling
function loadFromLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch (error) {
    console.error(`Error loading from localStorage: ${error.message}`);
    return null;
  }
}
