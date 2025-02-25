export default class Timer {
  constructor() {
    this.seconds = 0;
    this.minutes = 0;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        this.increment();
        this.display();
      }, 1000);
    }
  }

  stop() {
    if (this.isRunning) {
      clearInterval(this.intervalId);
      this.isRunning = false;
    }
  }

  reset() {
    this.stop();
    this.seconds = 0;
    this.minutes = 0;
    this.display();
  }

  increment() {
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
    }
  }

  display() {
    const timeString = `${this.formatTime(this.minutes)}:${this.formatTime(
      this.seconds
    )}`;
    return timeString;
  }

  formatTime(num) {
    return num.toString().padStart(2, "0");
  }
}
