class Timer {
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

  formatTime(num) {
    return num.toString().padStart(2, "0");
  }

  display() {
    const timeString = `${this.formatTime(this.minutes)}:${this.formatTime(
      this.seconds
    )}`;
    document.getElementById("timer").textContent = timeString;
  }
}

// Create HTML element for timer
const timerDisplay = document.createElement("div");
timerDisplay.id = "timer";
timerDisplay.textContent = "00:00";
document.body.appendChild(timerDisplay);

// Initialize timer
const timer = new Timer();

// Start the timer
timer.start();
