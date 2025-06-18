export function saveToLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage: ${error.message}`);
    }
}

export function loadFromLocalStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch (error) {
      console.error(`Error loading from localStorage: ${error.message}`);
      return null;
    }
}