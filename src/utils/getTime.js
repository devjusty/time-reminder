import { format, parse, getHours, getMinutes, getSeconds } from 'date-fns';

/**
 * Gets the current time as a formatted string (HH:mm:ss)
 * @returns {string} Formatted time string
 */
export function getCurrentTime() {
    return format(new Date(), 'HH:mm:ss');
}

/**
 * Gets hours, minutes, and seconds as separate numbers
 * @param {Date} date - The date object to extract time from
 * @returns {Object} Object containing hours, minutes, and seconds
 */
export function getTimeComponents(date = new Date()) {
    return {
        hours: getHours(date),
        minutes: getMinutes(date),
        seconds: getSeconds(date)
    };
}

/**
 * Parses a time string into a Date object
 * @param {string} timeString - Time string in HH:mm:ss format
 * @returns {Date} Date object with the parsed time
 */
export function parseTimeString(timeString) {
    return parse(timeString, 'HH:mm:ss', new Date());
}

/**
 * Formats a duration in seconds to HH:mm:ss format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted time string
 */
export function formatDuration(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return format(date, 'HH:mm:ss');
}