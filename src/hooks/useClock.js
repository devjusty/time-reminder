import { useState, useEffect, useCallback } from 'react';
import { useMotionValue, animate } from 'motion/react';
import { getTimeComponents } from '../utils/getTime';
import { useSettings } from './useSettings';
import { useAlarmChecker } from './useAlarmChecker';
import { useRemindUntil } from './useRemindUntil';
import Logger from '../utils/logger';

/**
 * Custom hook for managing clock functionality
 * Handles time updates, formatting, animations, and alarm integration
 */
export const useClock = () => {
  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Extract time components
  const { hours, minutes, seconds } = getTimeComponents(currentTime);

  // Settings and alarms
  const { settings } = useSettings();
  const { checkAlarms, resetTriggerOnMinuteChange, isAlarmActive } = useAlarmChecker();
  const { checkRemindUntil } = useRemindUntil();

  // Motion values for smooth animations
  const hourRotation = useMotionValue(0);
  const minuteRotation = useMotionValue(0);
  const secondRotation = useMotionValue(0);

  // Utility function for scaling values
  const scale = useCallback((num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }, []);

  // Helper function to add leading zeroes
  const addZero = useCallback((time) => {
    return time < 10 ? `0${time}` : time.toString();
  }, []);

  // Format time based on settings
  const formatTime = useCallback((hours, minutes, format = settings.hourFormat) => {
    if (format === '24h') {
      return `${hours}:${addZero(minutes)}`;
    } else {
      // 12-hour format
      let displayHour = hours;
      const am_pm = hours < 12 ? 'AM' : 'PM';

      if (displayHour > 12) displayHour -= 12;
      if (displayHour === 0) displayHour = 12;

      return `${displayHour}∶${addZero(minutes)} ${am_pm}`;
    }
  }, [settings.hourFormat, addZero]);

  // Get formatted time string
  const formattedTime = formatTime(hours, minutes);

  // Calculate active reminders and next reminder
  const getReminderInfo = useCallback(() => {
    const activeReminders = settings.reminders || [];
    const currentMinute = addZero(minutes);

    // Check if current time matches any active reminder
    const isCurrentlyActive = activeReminders.includes(currentMinute);

    // Find next reminder time
    const getNextReminder = () => {
      if (activeReminders.length === 0) return null;

      // Sort reminders numerically
      const sortedReminders = activeReminders.map(r => parseInt(r)).sort((a, b) => a - b);

      // Find next reminder in current hour
      const nextInHour = sortedReminders.find(reminderMin => reminderMin > minutes);

      if (nextInHour !== undefined) {
        // Next reminder is in current hour
        return {
          hour: hours,
          minute: nextInHour,
          formatted: formatTime(hours, nextInHour),
          isToday: true
        };
      } else {
        // Next reminder is in next hour (first reminder of the sorted list)
        const nextHour = (hours + 1) % 24;
        const firstReminder = sortedReminders[0];

        return {
          hour: nextHour,
          minute: firstReminder,
          formatted: formatTime(nextHour, firstReminder),
          isToday: nextHour > hours // false if it wraps to next day
        };
      }
    };

    return {
      activeReminders,
      isCurrentlyActive,
      nextReminder: getNextReminder(),
      activeCount: activeReminders.length,
      enabledTimes: activeReminders.sort((a, b) => parseInt(a) - parseInt(b))
    };
  }, [settings.reminders, hours, minutes, addZero, formatTime]);

  // Animation helper for smooth transitions
  const animateIfSmallChange = useCallback((motionValue, targetAngle, duration = 0.3) => {
    const currentAngle = motionValue.get();
    const diff = Math.abs(targetAngle - currentAngle);

    if (diff > 180) {
      // Large jump - set directly without animation to avoid the loop issue
      motionValue.set(targetAngle);
    } else {
      // Small change - animate smoothly
      animate(motionValue, targetAngle, {
        duration,
        ease: 'easeOut',
      });
    }
  }, []);

  // Calculate clock hand angles
  const updateClockAngles = useCallback(() => {
    const hourAngle = scale(hours % 12, 0, 12, 0, 360);
    const minuteAngle = scale(minutes, 0, 60, 0, 360);
    const secondAngle = scale(seconds, 0, 60, 0, 360);

    animateIfSmallChange(hourRotation, hourAngle, 0.5);
    animateIfSmallChange(minuteRotation, minuteAngle, 0.3);
    animateIfSmallChange(secondRotation, secondAngle, 0.1);
  }, [hours, minutes, seconds, scale, animateIfSmallChange, hourRotation, minuteRotation, secondRotation]);

  // Main clock update effect
  useEffect(() => {
    setIsMounted(true);
    Logger.verbose('Clock hook initialized');

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check for alarms and reset trigger state
      checkAlarms(now);
      resetTriggerOnMinuteChange(now);

      // Check remind-until functionality
      checkRemindUntil();
    }, 1000);

    return () => {
      clearInterval(interval);
      Logger.verbose('Clock hook cleanup');
    };
  }, [checkAlarms, resetTriggerOnMinuteChange, checkRemindUntil]);

  // Update clock angles when time changes
  useEffect(() => {
    if (isMounted) {
      updateClockAngles();
    }
  }, [updateClockAngles, isMounted]);

  // Return all clock-related data and functions
  return {
    // Time data
    currentTime,
    hours,
    minutes,
    seconds,
    formattedTime,

    // Animation values
    hourRotation,
    minuteRotation,
    secondRotation,

    // State
    isMounted,
    isAlarmActive,

    // Utility functions
    formatTime,
    addZero,
    scale,

    // Settings
    hourFormat: settings.hourFormat,

    // Reminder info
    reminderInfo: getReminderInfo()
  };
};
