import React, { useState, useEffect, useMemo } from "react";
import { SettingsContext } from "./settingsContext";
import { CONFIG } from "../config";
import Logger from "../utils/logger";
import { saveToLocalStorage, loadFromLocalStorage, isLocalStorageAvailable } from "../utils/storage";

const SettingsProvider = ({ children }) => {
  // Default settings (all reminders enabled for first-time users)
  const defaultSettings = useMemo(() => ({
    darkMode: true,
    hourFormat: "12h", // or '24h'
    reminders: ["00", "15", "30", "45"], // All enabled by default
    sound: {
      volume: 50, // 0-100
      selectedSound: "chime1", // chime1, double-chime
      enabled: true
    },
    remindUntil: {
      time: "17:00", // Default to 5:00 PM
      enabled: false
    },
  }), []);

  const [settings, setSettings] = useState(defaultSettings);

  // Log environment info on startup
  useEffect(() => {
    Logger.logEnvironment();
  }, []);

  // Validate and merge settings with defaults
  const validateAndMergeSettings = (savedSettings, defaults) => {
    try {
      // Ensure all required keys exist
      const merged = {
        darkMode: typeof savedSettings.darkMode === 'boolean' ? savedSettings.darkMode : defaults.darkMode,
        hourFormat: ['12h', '24h'].includes(savedSettings.hourFormat) ? savedSettings.hourFormat : defaults.hourFormat,
        reminders: Array.isArray(savedSettings.reminders) ? savedSettings.reminders : defaults.reminders,
        sound: {
          volume: (typeof savedSettings.sound?.volume === 'number' && savedSettings.sound.volume >= 0 && savedSettings.sound.volume <= 100)
            ? savedSettings.sound.volume
            : defaults.sound.volume,
          selectedSound: ['chime1', 'double-chime'].includes(savedSettings.sound?.selectedSound)
            ? savedSettings.sound.selectedSound
            : defaults.sound.selectedSound,
          enabled: typeof savedSettings.sound?.enabled === 'boolean'
            ? savedSettings.sound.enabled
            : defaults.sound.enabled
        },
        remindUntil: {
          time: (typeof savedSettings.remindUntil?.time === 'string' && /^([01]\d|2[0-3]):([0-5]\d)$/.test(savedSettings.remindUntil.time))
            ? savedSettings.remindUntil.time
            : defaults.remindUntil.time,
          enabled: typeof savedSettings.remindUntil?.enabled === 'boolean'
            ? savedSettings.remindUntil.enabled
            : defaults.remindUntil.enabled
        }
      };
      return merged;
    } catch (error) {
      Logger.error('Error validating settings, using defaults:', error);
      return defaults;
    }
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      Logger.warn('localStorage not available, using defaults with system preference');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSettings(prev => ({ ...prev, darkMode: prefersDark }));
      return;
    }

    const savedSettings = loadFromLocalStorage(CONFIG.STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      // Merge with defaults to ensure all required fields exist
      const validatedSettings = validateAndMergeSettings(savedSettings, defaultSettings);
      setSettings(validatedSettings);
    } else {
      Logger.log('No saved settings found, using defaults with system preference');
      // If no saved settings, use system preference for dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSettings(prev => ({ ...prev, darkMode: prefersDark }));
    }
  }, [defaultSettings]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    // Don't save on initial load (when settings equal defaults)
    if (JSON.stringify(settings) === JSON.stringify(defaultSettings)) {
      return;
    }

    const success = saveToLocalStorage(CONFIG.STORAGE_KEYS.SETTINGS, settings);
    if (!success) {
      Logger.error('Failed to save settings to localStorage');
    }
  }, [settings, defaultSettings]);

  // Update document theme when darkMode setting changes
  useEffect(() => {
    const theme = settings.darkMode ? 'mocha' : 'latte';
    Logger.log(`Setting theme to: ${theme} (darkMode: ${settings.darkMode})`);
    document.documentElement.setAttribute('data-theme', theme);

    // Also set the theme on the body for additional styling support
    document.body.setAttribute('data-theme', theme);
  }, [settings.darkMode]);

  const updateSetting = (key, value) => {
    Logger.log(`Updating setting: ${key} = ${value}`);
    setSettings((prev) => {
      // Handle nested object updates (like sound settings)
      if (key.includes('.')) {
        const keys = key.split('.');
        const newSettings = { ...prev };
        let current = newSettings;

        // Navigate to the nested object
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }

        // Set the final value
        current[keys[keys.length - 1]] = value;
        return newSettings;
      } else {
        // Handle top-level updates
        return { ...prev, [key]: value };
      }
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
