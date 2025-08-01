import { useEffect, useCallback } from 'react';
import { useSettings } from './useSettings';
import { useSound } from './useSound';
import Logger from '../utils/logger';

/**
 * Custom hook to handle the "Remind Until" functionality
 * Automatically disables all reminders at a specified time
 */
export const useRemindUntil = () => {
    const { settings, updateSetting } = useSettings();
    const { playSound } = useSound();

    // Helper function to add leading zero
    const addZero = useCallback((time) => {
        return time < 10 ? `0${time}` : time.toString();
    }, []);

    // Check if it's time to disable reminders
    const checkRemindUntil = useCallback(() => {
        if (!settings.remindUntil.enabled) return;

        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = `${addZero(hour)}:${addZero(minute)}`;

        if (currentTime === settings.remindUntil.time) {
            Logger.log(`Remind-until triggered at ${currentTime}`);

            // Disable all reminders
            updateSetting('reminders', []);

            // Play end sound (using double-chime as end sound)
            playSound('double-chime');

            // Disable remind-until feature
            updateSetting('remindUntil.enabled', false);

            // Return true to indicate remind-until was triggered
            return true;
        }

        return false;
    }, [settings.remindUntil, updateSetting, playSound, addZero]);

    // Run remind-until check every second
    useEffect(() => {
        if (!settings.remindUntil.enabled) return;

        const interval = setInterval(() => {
            checkRemindUntil();
        }, 1000);

        return () => clearInterval(interval);
    }, [settings.remindUntil.enabled, checkRemindUntil]);

    // Helper function to validate time format
    const isValidTime = useCallback((time) => {
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timePattern.test(time);
    }, []);

    // Helper function to update remind-until time
    const updateRemindUntilTime = useCallback((time) => {
        if (isValidTime(time)) {
            updateSetting('remindUntil.time', time);
            return true;
        }
        return false;
    }, [updateSetting, isValidTime]);

    // Helper function to toggle remind-until enabled state
    const toggleRemindUntil = useCallback(() => {
        updateSetting('remindUntil.enabled', !settings.remindUntil.enabled);
    }, [settings.remindUntil.enabled, updateSetting]);

    return {
        remindUntil: settings.remindUntil,
        updateRemindUntilTime,
        toggleRemindUntil,
        isValidTime,
        checkRemindUntil
    };
};
