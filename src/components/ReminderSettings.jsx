import React from "react";
import { useSettings } from "../hooks/useSettings";

const ReminderSettings = () => {
  const { settings, updateSetting } = useSettings();

  const toggleReminder = (time) => {
    const newReminders = settings.reminders.includes(time)
      ? settings.reminders.filter((r) => r !== time)
      : [...settings.reminders, time];
    updateSetting("reminders", newReminders);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Reminder Settings</h2>
      <p>Select intervals for reminders:</p>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {["00", "15", "30", "45"].map((time) => (
          <label className="label cursor-pointer" key={time}>
            <input 
              type="checkbox" 
              checked={settings.reminders.includes(time)} 
              onChange={() => toggleReminder(time)}
              className="toggle toggle-primary" 
            />
            <span className="label-text">:{time}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ReminderSettings;
