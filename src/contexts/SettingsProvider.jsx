import React, { useState, useEffect } from "react";
import { SettingsContext } from "./settingsContext";
import { CONFIG } from "../config";

const SettingsProvider = ({ children }) => {
  // Default settings (all reminders enabled for first-time users)
  const defaultSettings = {
    darkMode: true,
    hourFormat: "12h", // or '24h'
    reminders: ["00", "15", "30", "45"], // All enabled by default
    sound: {
      volume: 50, // 0-100
      selectedSound: "chime1", // chime1, double-chime
      enabled: true
    },
  };

  const [settings, setSettings] = useState(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
      console.log('Loading settings from localStorage:', savedSettings);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Parsed settings:', parsedSettings);
        // Completely replace settings with saved ones (don't merge)
        setSettings(parsedSettings);
      } else {
        console.log('No saved settings found, using defaults with system preference');
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
      console.log('Saving settings to localStorage:', settings);
      localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      console.log('Settings saved successfully');
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
