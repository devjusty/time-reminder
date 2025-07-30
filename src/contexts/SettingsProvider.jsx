import React, { useState, useEffect } from "react";
import { SettingsContext } from "./settingsContext";
import { CONFIG } from "../config";

const SettingsProvider = ({ children }) => {
  // Default settings
  const defaultSettings = {
    darkMode: true,
    sound: "default",
    hourFormat: "12h", // or '24h'
    reminders: ["00", "15", "30", "45"],
  };

  const [settings, setSettings] = useState(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } else {
        // If no saved settings, use system preference for dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setSettings(prev => ({ ...prev, darkMode: prefersDark }));
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      // Fallback to system preference on error
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSettings(prev => ({ ...prev, darkMode: prefersDark }));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [settings]);

  // Update document theme when darkMode setting changes
  useEffect(() => {
    const theme = settings.darkMode ? 'mocha' : 'latte';
    document.documentElement.setAttribute('data-theme', theme);
  }, [settings.darkMode]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
