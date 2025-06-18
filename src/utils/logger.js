const Logger = {
    DEBUG: false,
    log(...args) {
      if (this.DEBUG) {
        console.log(...args);
      }
    },
    error(...args) {
      console.error(...args);
    },
  };

  export default Logger;