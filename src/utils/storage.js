import Logger from './logger';

export function saveToLocalStorage(key, value) {
    try {
      Logger.verbose(`Saving to localStorage [${key}]:`, value);
      localStorage.setItem(key, JSON.stringify(value));
      Logger.verbose(`Successfully saved to localStorage [${key}]`);
      return true;
    } catch (error) {
      Logger.error(`Error saving to localStorage [${key}]:`, error.message);
      return false;
    }
}

export function loadFromLocalStorage(key) {
    try {
      const item = localStorage.getItem(key);
      Logger.verbose(`Loading from localStorage [${key}]:`, item);
      
      if (item === null) {
        Logger.verbose(`No data found in localStorage for key: ${key}`);
        return null;
      }
      
      const parsed = JSON.parse(item);
      Logger.verbose(`Successfully loaded from localStorage [${key}]:`, parsed);
      return parsed;
    } catch (error) {
      Logger.error(`Error loading from localStorage [${key}]:`, error.message);
      return null;
    }
}

// Utility function to check if localStorage is available
export function isLocalStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      Logger.warn('localStorage is not available:', error.message);
      return false;
    }
}

// Utility function to remove item from localStorage
export function removeFromLocalStorage(key) {
    try {
      Logger.verbose(`Removing from localStorage [${key}]`);
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      Logger.error(`Error removing from localStorage [${key}]:`, error.message);
      return false;
    }
}