export default class Timer {
  /**
   * Initialize the timer with an optional start value.
   * @param {number} [startValue=0] - The initial value of the timer.
   */
  constructor(startValue = 0) {
    this.startValue = startValue;
    this.currentTime = startValue;
    this.intervalId = null;
  }

  /**
   * Start the timer.
   * @param {number} [interval=1000] - The interval in milliseconds between increments.
   */
  start(interval = 1000) {
    this.intervalId = setInterval(() => {
      this.currentTime++;
    }, interval);
  }

  /**
   * Stop the timer.
   */
  stop() {
    clearInterval(this.intervalId);
  }

  /**
   * Get the current time.
   * @returns {number} The current time.
   */
  getTime() {
    return this.currentTime;
  }

  /**
   * Reset the timer to its start value.
   */
  reset() {
    this.currentTime = this.startValue;
  }
}
