// Configuration Object
const CONFIG = {
    // Time and Alarm Settings
    DEFAULT_REMIND_UNTIL: "17:00",
    REMINDER_INTERVALS: ["00", "15", "30", "45"],
  
    // Sound Paths
    SOUNDS: {
    ALARM_SOUND_PATH: "./src/assets/sounds/chime1.wav",
    END_SOUND_PATH: "./src/assets/sounds/double-chime.wav",
    },
  
    // UI Configuration
    UI: {
      MAX_ALARMS: 4
    },
  
    // Local Storage Keys
    STORAGE_KEYS: {
      ALARMS: "alarms",
      REMIND_UNTIL: "remindUntil",
    },
  
    // Debug Settings
    DEBUG: {
    //   ENABLED: process.env.NODE_ENV !== "production",
      LOG_LEVEL: "info"
    }
  };

const Settings = () => {
    return (
        <div>
            <h2>Settings</h2>
        </div>
    );
};

export default Settings;