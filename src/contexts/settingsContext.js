import { createContext } from "react";

/**
 * Settings Context for managing app-wide settings
 * @typedef {Object} SettingsContextValue
 * @property {Object} settings - Current settings object
 * @property {Function} updateSetting - Function to update a specific setting
 */

// Default context value to prevent errors when used outside provider
const defaultContextValue = {
    settings: {
        darkMode: true,
        hourFormat: "12h",
        reminders: ["00", "15", "30", "45"],
        sound: {
            volume: 50,
            selectedSound: "chime1",
            enabled: true
        }
    },
    updateSetting: () => {
        console.warn('updateSetting called outside of SettingsProvider');
    }
};

export const SettingsContext = createContext(defaultContextValue);
