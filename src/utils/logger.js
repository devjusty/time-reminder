import { CONFIG } from '../config';

const Logger = {
    get DEBUG() {
      return CONFIG.DEBUG.ENABLED;
    },
    get VERBOSE() {
      return CONFIG.DEBUG.VERBOSE_STORAGE;
    },
    
    // Development logging (only in dev mode)
    log(...args) {
      if (this.DEBUG) {
        console.log(`[${new Date().toLocaleTimeString()}]`, ...args);
      }
    },
    
    // Always log errors (production + development)
    error(...args) {
      console.error(`[${new Date().toLocaleTimeString()}] ERROR:`, ...args);
    },
    
    // Always log warnings (production + development)
    warn(...args) {
      console.warn(`[${new Date().toLocaleTimeString()}] WARN:`, ...args);
    },
    
    // Info logging (only in dev mode)
    info(...args) {
      if (this.DEBUG) {
        console.info(`[${new Date().toLocaleTimeString()}] INFO:`, ...args);
      }
    },
    
    // Verbose logging for storage operations (only when explicitly enabled)
    verbose(...args) {
      if (this.DEBUG && this.VERBOSE) {
        console.log(`[${new Date().toLocaleTimeString()}] VERBOSE:`, ...args);
      }
    },
    
    // Environment info
    logEnvironment() {
      if (this.DEBUG) {
        console.group('🔧 Environment Info');
        console.log('Mode:', import.meta.env.MODE);
        console.log('Debug enabled:', this.DEBUG);
        console.log('Verbose storage:', this.VERBOSE);
        console.log('Log level:', CONFIG.DEBUG.LOG_LEVEL);
        console.groupEnd();
      }
    }
  };

  export default Logger;