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
          <fieldset className="fieldset">
              <legend className="fieldset-legend font-bold opacity-80">
                <div className="tooltip" data-tip="Select intervals for reminders">
                  Reminder Settings
                </div>
              </legend>

              <div className="grid grid-cols-2 gap-2">
                  {['00', '15', '30', '45'].map((time) => (
                      <label className="label cursor-pointer" key={time}>
                          <input
                              type="checkbox"
                              checked={settings.reminders.includes(time)}
                              onChange={() => toggleReminder(time)}
                              className="toggle toggle-primary"
                          />
                          ∶{time}
                      </label>
                  ))}
              </div>
          </fieldset>
      </div>
  );
};

export default ReminderSettings;
