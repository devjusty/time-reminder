// Configuration Object for Time Reminder App
export const CONFIG = {
  // Time and Alarm Settings
  DEFAULT_REMIND_UNTIL: "17:00",
  REMINDER_INTERVALS: ["00", "15", "30", "45"],

  // Sound Paths
  SOUNDS: {
    ALARM_SOUND_PATH: "/src/assets/sounds/chime1.wav",
    END_SOUND_PATH: "/src/assets/sounds/double-chime.wav",
  },

  // UI Configuration
  UI: {
    MAX_ALARMS: 4
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    ALARMS: "alarms",
    REMIND_UNTIL: "remindUntil",
    SETTINGS: "timeReminder_settings",
    SHOW_INTRO_TEXT: "showIntroText",
  },

  // Debug Settings - Automatically enabled in development, disabled in production
  DEBUG: {
    // Enable logging in development mode, disable in production builds
    ENABLED: import.meta.env.MODE !== "production" || import.meta.env.VITE_DEBUG === "true",
    // Log level for debugging (info, warn, error)
    LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || "info",
    // Show verbose storage operations
    VERBOSE_STORAGE: import.meta.env.VITE_VERBOSE_STORAGE === "true"
  }
};
