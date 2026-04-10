import { createContext } from "react";
import Logger from "../utils/logger";

/**
 * Settings Context for managing app-wide settings
 * @typedef {Object} SettingsContextValue
 * @property {Object} settings - Current settings object
 * @property {Function} updateSetting - Function to update a specific setting
 */

// Default context value to prevent errors when using the context outside of a provider
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
    // Placeholder function that logs a warning if updateSetting is called outside of a provider
    // TODO: Consider throwing an error instead to enforce proper usage of the context
    updateSetting: () => {
        Logger.warn('updateSetting called outside of SettingsProvider');
    }
};

export const SettingsContext = createContext(defaultContextValue);
