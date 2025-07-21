import React, { useState } from "react";
import { SettingsContext } from "./settingsContext";

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    sound: "default",
    hourFormat: "12h", // or '24h'
    reminders: ["00", "15", "30", "45"],
  });

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
