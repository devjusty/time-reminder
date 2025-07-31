import { useState, useCallback } from 'react';
import { useSettings } from './useSettings';
import { useSound } from './useSound';
import Logger from '../utils/logger';

export const useAlarmChecker = () => {
  const { settings } = useSettings();
  const { playSound } = useSound();
  const [lastTriggeredMinute, setLastTriggeredMinute] = useState(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  // Helper function to add leading zero (ported from old script)
  const addZero = (time) => {
    return time < 10 ? `0${time}` : time.toString();
  };

  // Main alarm checking logic (ported from timeReminder function)
  const checkAlarms = useCallback((currentTime) => {
    const currentMinute = addZero(currentTime.getMinutes());

    // Skip processing if already triggered for this minute
    if (lastTriggeredMinute === currentMinute) {
      return;
    }

    // Check if current minute matches any active reminders
    const reminderMinutes = ["00", "15", "30", "45"];
    let alarmTriggered = false;

    reminderMinutes.forEach((time) => {
      // Check if this reminder time is enabled in settings and matches current minute
      if (settings.reminders.includes(time) && currentMinute === time) {
        Logger.log(`Alarm triggered for ${time} at ${currentMinute}`);

        try {
          // Play alarm sound
          playSound();
          alarmTriggered = true;

          // Set visual alert state
          setIsAlarmActive(true);

          // Remove visual alert after 3 seconds (matching old script behavior)
          setTimeout(() => {
            setIsAlarmActive(false);
          }, 3000);

        } catch (error) {
          Logger.error("Error playing alarm sound:", error);
        }
      }
    });

    if (alarmTriggered) {
      setLastTriggeredMinute(currentMinute);
    }
  }, [settings.reminders, lastTriggeredMinute, playSound]);

  // Reset lastTriggeredMinute when minute changes to allow new triggers
  const resetTriggerOnMinuteChange = useCallback((currentTime) => {
    const currentMinute = addZero(currentTime.getMinutes());
    if (lastTriggeredMinute && lastTriggeredMinute !== currentMinute) {
      // Only reset if we've moved to a different minute
      const reminderMinutes = ["00", "15", "30", "45"];
      if (!reminderMinutes.includes(currentMinute)) {
        // Reset trigger state when we're not on a reminder minute
        setLastTriggeredMinute(null);
      }
    }
  }, [lastTriggeredMinute]);

  return {
    checkAlarms,
    resetTriggerOnMinuteChange,
    isAlarmActive,
    lastTriggeredMinute
  };
};
