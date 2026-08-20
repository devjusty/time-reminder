import alarmSoundUrl from "../assets/sounds/chime1.mp3";
import endSoundUrl from "../assets/sounds/double-chime.mp3";

// Shared variables for clock and reminders
const ALARM_KEYS = ["alarm1", "alarm2", "alarm3", "alarm4"] as const;
type AlarmKey = (typeof ALARM_KEYS)[number];
type AlarmState = Record<AlarmKey, boolean>;

const DEFAULT_ALARMS: AlarmState = {
  alarm1: true,
  alarm2: false,
  alarm3: false,
  alarm4: false,
};

let alarms: AlarmState = { ...DEFAULT_ALARMS };
let remindUntil = {
  time: "17:00",
  enabled: false,
};
let lastTriggeredMinute: string | null = null;

// Utility: Logger - Disable in Production
const Logger = {
  DEBUG: false,
  log(...args: unknown[]): void {
    if (this.DEBUG) {
      console.log(...args);
    }
  },

  error(...args: unknown[]): void {
    console.error(...args);
  },
};

// Utility: Save data to localStorage with error handling
function saveToLocalStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error saving to localStorage: ${errorMessage}`);
  }
}

// Utility: Load data from localStorage with error handling
function loadFromLocalStorage(key: string) {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error loading from localStorage: ${errorMessage}`);
    return null;
  }
}

// Configuration Object
const CONFIG = {
  // Time and Alarm Settings
  DEFAULT_REMIND_UNTIL: "17:00",
  REMINDER_INTERVALS: ["00", "15", "30", "45"],

  // Sound Paths
  SOUNDS: {
    ALARM_SOUND_PATH: alarmSoundUrl,
    END_SOUND_PATH: endSoundUrl,
  },

  // UI Configuration
  UI: {
    MAX_ALARMS: 4,
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    ALARMS: "alarms",
    REMIND_UNTIL: "remindUntil",
  },

  // Debug Settings
  DEBUG: {
    // ENABLED: ProcessingInstruction.env.NODE_ENV !== "production",
    LOG_LEVEL: "info",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initializeAlarms();
  initializeRemindUntil();
  initializeReminderControls();
  initializeVolumeControls();
  initializeAlarmListeners();
  getTime();
  setInterval(getTime, 1000);
});

function initializeReminderControls() {
  const remindUntilInput = document.getElementById(
    "remind-until",
  ) as HTMLInputElement;
  const remindUntilToggle = document.getElementById(
    "remind-until-toggle",
  ) as HTMLInputElement;

  if (remindUntilInput) {
    remindUntilInput.value = remindUntil.time;
    remindUntilInput.addEventListener("change", (e) => {
      remindUntil.time = (e.target as HTMLInputElement).value;
      saveRemindUntil();
      updateScheduleStatus();
    });
  }

  if (remindUntilToggle) {
    remindUntilToggle.checked = remindUntil.enabled;
    remindUntilToggle.addEventListener("change", (e) => {
      remindUntil.enabled = (e.target as HTMLInputElement).checked;
      saveRemindUntil();
      updateScheduleStatus();
    });
  }

  updateScheduleStatus();
}

const alarmSound = new Audio(CONFIG.SOUNDS.ALARM_SOUND_PATH);
const endSound = new Audio(CONFIG.SOUNDS.END_SOUND_PATH);

function initializeVolumeControls() {
  const volumeSlider = document.querySelector<HTMLInputElement>("#volume");
  const volumeValueDisplay = document.getElementById(
    "volume-value",
  ) as HTMLElement;

  if (!volumeSlider) return;

  // Set initial volume
  const initialVolume = volumeSlider.valueAsNumber || 50; // Default to 50 if not set

  alarmSound.volume = initialVolume / 100;
  endSound.volume = initialVolume / 100;

  if (volumeValueDisplay) {
    volumeValueDisplay.textContent = initialVolume.toString();
  }

  volumeSlider.addEventListener("input", (e) => {
    const volume = (e.target as HTMLInputElement).valueAsNumber;

    alarmSound.volume = volume / 100; // Set volume between 0 and 1
    endSound.volume = volume / 100; // Set volume between 0 and 1

    if (volumeValueDisplay) {
      volumeValueDisplay.textContent = volume.toString(); // Update displayed volume value
    }
  });
}

// Utility function for scaling values (e.g., for clock rotation)
const scale = (
  num: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
) => ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;

function getTime() {
  // Get the current time
  const now = new Date();
  let hour = now.getHours();
  const minute: number = now.getMinutes();
  const second: number = now.getSeconds();
  const am_pm = hour < 12 ? "AM" : "PM";

  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  // Update the analog clock
  const hourEl = document.querySelector(".needle.hour") as HTMLElement;
  const minuteEl = document.querySelector(".needle.minute") as HTMLElement;
  const secondEl = document.querySelector(".needle.second") as HTMLElement;

  if (hourEl)
    hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(
      hour,
      0,
      12,
      0,
      360,
    )}deg)`;
  if (minuteEl)
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(
      minute,
      0,
      60,
      0,
      360,
    )}deg)`;
  if (secondEl)
    secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(
      second,
      0,
      60,
      0,
      360,
    )}deg)`;

  // Update the digital clock
  const currentTime = `${addZero(hour)}:${addZero(minute)} ${am_pm}`;
  const digitalClockEl = document.getElementById("digital-clock");
  if (digitalClockEl) digitalClockEl.innerHTML = currentTime;

  checkRemindUntil();
  lastTriggeredMinute = timeReminder(
    minute,
    lastTriggeredMinute,
    alarms,
    alarmSound,
  );
}

// Add leading zeroes for time values
const addZero = (time: number): string => (time < 10 ? `0${time}` : `${time}`);

// Initialize alarm settings
function initializeAlarms() {
  const restoredSession = loadFromLocalStorage(CONFIG.STORAGE_KEYS.ALARMS);
  alarms = isAlarmState(restoredSession)
    ? restoredSession
    : { ...DEFAULT_ALARMS };

  saveAlarms();
  restoreAlarms();
}

function updateScheduleStatus() {
  const scheduleStatus = document.getElementById("schedule-status");
  if (!scheduleStatus) return;

  const selectedIntervals = CONFIG.REMINDER_INTERVALS.filter(
    (_, index) => alarms[ALARM_KEYS[index]],
  );

  if (selectedIntervals.length === 0) {
    scheduleStatus.textContent =
      "No reminders selected. Select at least one time.";
    return;
  }

  const remindUntilText = remindUntil.enabled
    ? ` Reminders stop at ${remindUntil.time}.`
    : "";
  scheduleStatus.textContent = `Reminders set for :${selectedIntervals.join(", :")}.${remindUntilText}`;
}

// Save alarms to localStorage
function saveAlarms() {
  saveToLocalStorage("alarms", alarms);
}

// Restore alarm states to the UI
function restoreAlarms() {
  for (const alarm of ALARM_KEYS) {
    const button = document.getElementById(alarm);
    if (button) {
      button.classList.toggle("active", alarms[alarm]);
      button.setAttribute("aria-pressed", String(alarms[alarm]));
    }
  }
  toggleNotches();
}

// Toggle alarm state when a button is clicked
function toggleAlarm(event: Event) {
  const button = event.currentTarget as HTMLButtonElement;
  const alarmId = button.id as AlarmKey;
  if (ALARM_KEYS.includes(alarmId)) {
    alarms[alarmId] = !alarms[alarmId];
    button.classList.toggle("active", alarms[alarmId]);
    button.setAttribute("aria-pressed", String(alarms[alarmId]));
    saveAlarms();
    toggleNotches();
    updateScheduleStatus();
  }
}

function initializeAlarmListeners() {
  ALARM_KEYS.forEach((alarmId) => {
    const button = document.querySelector(`#${alarmId}`);
    if (button) {
      button.addEventListener("click", toggleAlarm);
    }
  });
}

// Update notches on the analog clock based on alarms
function toggleNotches() {
  const alarmNotchClasses = ["zero", "fifteen", "thirty", "fortyfive"];
  alarmNotchClasses.forEach((className, index) => {
    const notch = document.querySelector(`.${className}`);
    const alarmKey = ALARM_KEYS[index];
    if (notch) {
      notch.classList.toggle("active", alarms[alarmKey]);
    }
  });
}

function isAlarmState(value: unknown): value is AlarmState {
  return (
    typeof value === "object" &&
    value !== null &&
    ALARM_KEYS.every(
      (key) => typeof (value as Record<string, unknown>)[key] === "boolean",
    )
  );
}

// Initialize the "Remind Until" feature
function initializeRemindUntil() {
  const savedRemindUntil = loadFromLocalStorage("remindUntil");

  // time validation
  function isValidTime(time: string): boolean {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(time);
  }

  if (savedRemindUntil) {
    // validate time
    if (
      typeof savedRemindUntil === "object" &&
      savedRemindUntil !== null &&
      typeof savedRemindUntil.time === "string" &&
      isValidTime(savedRemindUntil.time) &&
      typeof savedRemindUntil.enabled === "boolean"
    ) {
      remindUntil = savedRemindUntil; // Overwrite remindUntil with saved data
    } else {
      // Fallback to default
      remindUntil = {
        time: CONFIG.DEFAULT_REMIND_UNTIL,
        enabled: false,
      };
      saveRemindUntil();
      console.warn(
        "Invalid time format. Fallback to default remindUntil settings.",
      );
    }
  }

  const remindUntilInput = document.getElementById(
    "remind-until",
  ) as HTMLInputElement;
  const remindUntilToggle = document.getElementById(
    "remind-until-toggle",
  ) as HTMLInputElement;

  if (remindUntilInput) {
    remindUntilInput.value = remindUntil.time;
  }
  if (remindUntilToggle) {
    remindUntilToggle.checked = remindUntil.enabled;
  }
}

// Save "Remind Until" settings to localStorage
function saveRemindUntil() {
  saveToLocalStorage("remindUntil", remindUntil);
}

function setAudioError(message = "") {
  const audioError = document.getElementById("audio-error");
  if (audioError) audioError.textContent = message;
}

function playReminderSound(sound: HTMLAudioElement) {
  setAudioError();

  try {
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      void playPromise
        .then(() => setAudioError())
        .catch((error: unknown) => {
          Logger.error("Error playing reminder sound:", error);
          setAudioError(
            "Unable to play reminder sound. Check your browser audio permission.",
          );
        });
    }
  } catch (error) {
    Logger.error("Error playing reminder sound:", error);
    setAudioError(
      "Unable to play reminder sound. Check your browser audio permission.",
    );
  }
}

// Check and handle "Remind Until" functionality
function checkRemindUntil() {
  if (!remindUntil.enabled) return;

  const now = new Date();
  const hour = now.getHours();
  const currentTime = `${addZero(hour)}:${addZero(now.getMinutes())}`;

  if (currentTime === remindUntil.time) {
    ALARM_KEYS.forEach((alarmId) => {
      alarms[alarmId] = false;
    });
    saveAlarms();
    restoreAlarms();
    playReminderSound(endSound);
    remindUntil.enabled = false;
    const remindUntilToggle = document.getElementById(
      "remind-until-toggle",
    ) as HTMLInputElement;
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
function timeReminder(
  minute: number,
  lastTriggeredMinute: string | null,
  alarms: Record<string, boolean>,
  alarmSound: HTMLAudioElement,
): string | null {
  const currentMinute = addZero(minute);

  // console.log("Current minute:", currentMinute);
  // console.log("Last triggered minute:", lastTriggeredMinute);

  if (lastTriggeredMinute === currentMinute) {
    // Skip processing if already triggered for this minute
    Logger.log("Skipping, already triggered for this minute.", currentMinute);
    return lastTriggeredMinute;
  }

  // Cache the clock element
  const clock = document.querySelector(".clock");
  if (!clock) {
    console.error(".clock element not found in the DOM!");
    return lastTriggeredMinute;
  }

  // Process reminders
  let alarmTriggered = false;

  // Check all active alarms
  CONFIG.REMINDER_INTERVALS.forEach((time, index) => {
    const alarmKey = ALARM_KEYS[index];
    // console.log(`Checking ${alarmKey} for ${time}:`, alarms[alarmKey]);

    if (alarms[alarmKey] && currentMinute === time) {
      Logger.log(`Playing alarm for ${alarmKey} at ${currentMinute}`);
      try {
        // Check if sound is not already playing
        if (alarmSound.paused) {
          alarmSound.currentTime = 0;
          playReminderSound(alarmSound);
        }
      } catch (error) {
        Logger.error("Error playing alarm sound:", error);
        setAudioError(
          "Unable to play reminder sound. Check your browser audio permission.",
        );
      }
      alarmTriggered = true;

      // Trigger combined visual effect

      // console.log("Adding alert class to .clock");
      clock.classList.add("alert");
      setTimeout(() => {
        // console.log("Removing alert class from .clock");
        clock.classList.remove("alert"); // Remove effect after 3 seconds
      }, 3000);
    }
  });

  if (alarmTriggered) {
    Logger.log(
      "Alarms triggered. Updating lastTriggeredMinute:",
      currentMinute,
    );
    return currentMinute;
  }

  return lastTriggeredMinute;
}
