import toast from "sonner-js";
import { evaluateReminder } from "./reminder-logic";
import alarmSoundUrl from "../assets/sounds/chime1.mp3";
import endSoundUrl from "../assets/sounds/double-chime.mp3";

const ALARM_KEYS = ["alarm1", "alarm2", "alarm3", "alarm4"] as const;
type AlarmKey = (typeof ALARM_KEYS)[number];
type AlarmState = Record<AlarmKey, boolean>;

const DEFAULT_ALARMS: AlarmState = {
  alarm1: true,
  alarm2: false,
  alarm3: false,
  alarm4: false,
};

const CONFIG = {
  DEFAULT_REMIND_UNTIL: "17:00",
  REMINDER_INTERVALS: ["00", "15", "30", "45"] as const,
  SOUNDS: {
    ALARM_SOUND_PATH: alarmSoundUrl,
    END_SOUND_PATH: endSoundUrl,
  },
  STORAGE_KEYS: {
    ALARMS: "alarms",
    REMIND_UNTIL: "remindUntil",
  },
};

type RemindUntilState = {
  time: string;
  enabled: boolean;
};

let alarms: AlarmState = { ...DEFAULT_ALARMS };
let remindUntil: RemindUntilState = {
  time: CONFIG.DEFAULT_REMIND_UNTIL,
  enabled: false,
};
let lastTriggeredMinute: string | null = null;
let runtimeStarted = false;
let audioErrorTimeout: ReturnType<typeof setTimeout> | null = null;
let audioPlaybackRequest = 0;
let lastReportedError = "";
let lastReportedErrorAt = 0;

const alarmSound = new Audio(CONFIG.SOUNDS.ALARM_SOUND_PATH);
const endSound = new Audio(CONFIG.SOUNDS.END_SOUND_PATH);

toast.config({
  toastOptions: {
    position: "bottom-right",
    closeButton: true,
    richColors: true,
    duration: 5000,
  },
});

const Logger = {
  error(...args: unknown[]): void {
    console.error(...args);
  },
};

function notifyReminder(interval: string): void {
  toast.success(`Reminder at :${interval}`);
}

function notifyEndTime(time: string): void {
  toast.info(`Reminders stopped at ${time}`);
}

function reportError(message: string, error?: unknown): void {
  Logger.error(message, error);

  const now = Date.now();
  if (message === lastReportedError && now - lastReportedErrorAt < 5000) {
    return;
  }
  lastReportedError = message;
  lastReportedErrorAt = now;
  toast.error(message);
}

function saveToLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    reportError(`Error saving settings: ${getErrorMessage(error)}`, error);
  }
}

function loadFromLocalStorage(key: string): unknown {
  try {
    const value = localStorage.getItem(key);
    return value === null ? null : JSON.parse(value);
  } catch (error) {
    reportError(`Error loading settings: ${getErrorMessage(error)}`, error);
    return null;
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function saveAlarms(): void {
  saveToLocalStorage(CONFIG.STORAGE_KEYS.ALARMS, alarms);
}

function saveRemindUntil(): void {
  saveToLocalStorage(CONFIG.STORAGE_KEYS.REMIND_UNTIL, remindUntil);
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

function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

function initializeAlarms(): void {
  const restored = loadFromLocalStorage(CONFIG.STORAGE_KEYS.ALARMS);
  alarms = isAlarmState(restored) ? restored : { ...DEFAULT_ALARMS };
  saveAlarms();
}

function initializeRemindUntil(): void {
  const restored = loadFromLocalStorage(CONFIG.STORAGE_KEYS.REMIND_UNTIL);
  if (
    typeof restored === "object" &&
    restored !== null &&
    typeof (restored as Record<string, unknown>).time === "string" &&
    isValidTime((restored as Record<string, string>).time) &&
    typeof (restored as Record<string, unknown>).enabled === "boolean"
  ) {
    remindUntil = restored as RemindUntilState;
    return;
  }

  if (restored !== null) {
    saveRemindUntil();
    reportError("Invalid reminder end-time settings. Defaults restored.");
  }
}

function addZero(time: number): string {
  return time < 10 ? `0${time}` : `${time}`;
}

function scale(
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function updateScheduleStatus(): void {
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

function toggleNotches(): void {
  ["zero", "fifteen", "thirty", "fortyfive"].forEach((className, index) => {
    const notch = document.querySelector(`.${className}`);
    if (notch) notch.classList.toggle("active", alarms[ALARM_KEYS[index]]);
  });
}

function restoreHomepageState(): void {
  for (const alarm of ALARM_KEYS) {
    const button = document.getElementById(alarm);
    if (button) {
      button.classList.toggle("active", alarms[alarm]);
      button.setAttribute("aria-pressed", String(alarms[alarm]));
    }
  }

  const remindUntilInput = document.getElementById(
    "remind-until",
  ) as HTMLInputElement | null;
  const remindUntilToggle = document.getElementById(
    "remind-until-toggle",
  ) as HTMLInputElement | null;
  if (remindUntilInput) remindUntilInput.value = remindUntil.time;
  if (remindUntilToggle) remindUntilToggle.checked = remindUntil.enabled;

  toggleNotches();
  updateScheduleStatus();
}

function toggleAlarm(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement;
  const alarmId = button.id as AlarmKey;
  if (!ALARM_KEYS.includes(alarmId)) return;

  alarms[alarmId] = !alarms[alarmId];
  button.classList.toggle("active", alarms[alarmId]);
  button.setAttribute("aria-pressed", String(alarms[alarmId]));
  saveAlarms();
  toggleNotches();
  updateScheduleStatus();
}

function bindHomepageView(): void {
  if (!document.getElementById("digital-clock")) return;

  restoreHomepageState();

  for (const alarm of ALARM_KEYS) {
    const button = document.getElementById(alarm);
    if (button?.dataset.timeReminderBound === "true") continue;
    if (button) {
      button.dataset.timeReminderBound = "true";
      button.addEventListener("click", toggleAlarm);
    }
  }

  const remindUntilInput = document.getElementById(
    "remind-until",
  ) as HTMLInputElement | null;
  if (remindUntilInput?.dataset.timeReminderBound !== "true") {
    remindUntilInput?.addEventListener("change", (event) => {
      remindUntil.time = (event.target as HTMLInputElement).value;
      saveRemindUntil();
      updateScheduleStatus();
    });
    if (remindUntilInput) remindUntilInput.dataset.timeReminderBound = "true";
  }

  const remindUntilToggle = document.getElementById(
    "remind-until-toggle",
  ) as HTMLInputElement | null;
  if (remindUntilToggle?.dataset.timeReminderBound !== "true") {
    remindUntilToggle?.addEventListener("change", (event) => {
      remindUntil.enabled = (event.target as HTMLInputElement).checked;
      saveRemindUntil();
      updateScheduleStatus();
    });
    if (remindUntilToggle) remindUntilToggle.dataset.timeReminderBound = "true";
  }

  const volumeSlider = document.getElementById(
    "volume",
  ) as HTMLInputElement | null;
  const volumeValueDisplay = document.getElementById("volume-value");
  if (volumeSlider && volumeSlider.dataset.timeReminderBound !== "true") {
    const updateVolume = (event: Event) => {
      const volume = (event.target as HTMLInputElement).valueAsNumber;
      alarmSound.volume = volume / 100;
      endSound.volume = volume / 100;
      if (volumeValueDisplay)
        volumeValueDisplay.textContent = volume.toString();
    };
    alarmSound.volume = volumeSlider.valueAsNumber / 100;
    endSound.volume = volumeSlider.valueAsNumber / 100;
    volumeSlider.addEventListener("input", updateVolume);
    volumeSlider.dataset.timeReminderBound = "true";
  }
}

function setAudioError(message = ""): void {
  if (audioErrorTimeout !== null) clearTimeout(audioErrorTimeout);
  audioErrorTimeout = null;

  const audioError = document.getElementById("audio-error");
  if (audioError) audioError.textContent = message;

  if (message) {
    audioErrorTimeout = setTimeout(() => {
      const currentAudioError = document.getElementById("audio-error");
      if (currentAudioError) currentAudioError.textContent = "";
      audioErrorTimeout = null;
    }, 5000);
  }
}

function playReminderSound(sound: HTMLAudioElement): void {
  const playbackRequest = ++audioPlaybackRequest;
  try {
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      void playPromise
        .then(() => {
          if (playbackRequest === audioPlaybackRequest) setAudioError();
        })
        .catch((error: unknown) => {
          if (playbackRequest !== audioPlaybackRequest) return;
          const message =
            "Unable to play reminder sound. Check your browser audio permission.";
          setAudioError(message);
          reportError(message, error);
        });
    }
  } catch (error) {
    const message =
      "Unable to play reminder sound. Check your browser audio permission.";
    setAudioError(message);
    reportError(message, error);
  }
}

function triggerClockAlert(): void {
  const clock = document.querySelector(".clock");
  if (!clock) return;
  clock.classList.add("alert");
  setTimeout(() => clock.classList.remove("alert"), 3000);
}

function checkRemindUntil(): void {
  if (!remindUntil.enabled) return;

  const now = new Date();
  const currentTime = `${addZero(now.getHours())}:${addZero(now.getMinutes())}`;
  if (currentTime !== remindUntil.time) return;

  for (const alarm of ALARM_KEYS) alarms[alarm] = false;
  remindUntil.enabled = false;
  saveAlarms();
  saveRemindUntil();
  playReminderSound(endSound);
  notifyEndTime(currentTime);
  restoreHomepageState();
  triggerClockAlert();
}

function timeReminder(now: Date): void {
  const currentTimeKey = `${now.getFullYear()}-${addZero(now.getMonth() + 1)}-${addZero(now.getDate())}-${addZero(now.getHours())}:${addZero(now.getMinutes())}`;
  const decision = evaluateReminder(
    now.getMinutes(),
    currentTimeKey,
    lastTriggeredMinute,
    alarms,
    CONFIG.REMINDER_INTERVALS,
  );
  lastTriggeredMinute = decision.nextLastTriggeredMinute;
  if (!decision.triggered) return;

  alarmSound.currentTime = 0;
  if (alarmSound.paused) playReminderSound(alarmSound);
  notifyReminder(addZero(now.getMinutes()));
  triggerClockAlert();
}

function getTime(): void {
  try {
    const now = new Date();
    let hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const amPm = hour < 12 ? "AM" : "PM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    const hourEl = document.querySelector(".needle.hour") as HTMLElement | null;
    const minuteEl = document.querySelector(
      ".needle.minute",
    ) as HTMLElement | null;
    const secondEl = document.querySelector(
      ".needle.second",
    ) as HTMLElement | null;
    if (hourEl)
      hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hour, 0, 12, 0, 360)}deg)`;
    if (minuteEl)
      minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(minute, 0, 60, 0, 360)}deg)`;
    if (secondEl)
      secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(second, 0, 60, 0, 360)}deg)`;

    const digitalClock = document.getElementById("digital-clock");
    if (digitalClock)
      digitalClock.textContent = `${addZero(hour)}:${addZero(minute)} ${amPm}`;

    checkRemindUntil();
    timeReminder(now);
  } catch (error) {
    reportError("Unable to process reminder state.", error);
  }
}

function initializeRuntime(): void {
  if (!runtimeStarted) {
    runtimeStarted = true;
    initializeAlarms();
    initializeRemindUntil();
    setInterval(getTime, 1000);
  }

  bindHomepageView();
  getTime();
}

document.addEventListener("astro:page-load", initializeRuntime);
document.addEventListener("DOMContentLoaded", initializeRuntime, {
  once: true,
});
