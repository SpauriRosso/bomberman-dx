export default class Timer {
  constructor() {
    this.seconds = 0;
    this.minutes = 0;
    this.intervalId = null;
    this.isRunning = false;
    this.isPaused = false;

    document.addEventListener("pauseToggled", (e) => {
      this.isPaused = e.detail.isPaused;
      if (this.isPaused) {
        this.stop();
      } else {
        this.resume();
      }
    });
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        if (!this.isPaused) {
          this.increment();
        }
      }, 1000);
    }
  }

  stop() {
    clearInterval(this.intervalId);
    this.isRunning = false;
  }

  resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  reset() {
    this.stop();
    this.seconds = 0;
    this.minutes = 0;
  }

  increment() {
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
    }
  }

  display() {
    return `${this.formatTime(this.minutes)}:${this.formatTime(this.seconds)}`;
  }

  formatTime(num) {
    return num.toString().padStart(2, "0");
  }
}
