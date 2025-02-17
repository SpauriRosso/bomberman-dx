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
    const timerElement = document.getElementById("timer");
    timerElement.textContent = timeString;
    timerElement.style.position = "absolute";
    timerElement.style.top = "80px";
    timerElement.style.right = "10px";
    timerElement.style.fontSize = "25px";
    timerElement.style.fontWeight = "bold";
    timerElement.style.color = "black";
    timerElement.style.padding = "5px";
    timerElement.style.borderRadius = "5px";
    timerElement.style.cursor = "default";
    timerElement.style.fontFamily = "bomberman";
    document.body.appendChild(timerElement);
  }

  formatTime(num) {
    return num.toString().padStart(2, "0");
  }
}
