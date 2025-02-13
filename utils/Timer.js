export default class Timer {
  constructor() {
    this.time = 0;
    this.interval = 1000; // Start at 1 second
    this.lastUpdate = performance.now();

    // Create a timer display element
    this.timerElement = document.createElement("div");
    this.timerElement.style.position = "absolute";
    this.timerElement.style.top = "10px";
    this.timerElement.style.left = "20px";
    this.timerElement.style.padding = "10px 20px";
    this.timerElement.style.color = "#fff";
    this.timerElement.style.fontSize = "20px";
    this.timerElement.style.fontFamily = "Bomberman";
    this.timerElement.style.borderRadius = "8px";

    this.timerElement.innerText = `Timer: ${this.time}s`;
    document.body.appendChild(this.timerElement);
  }

  update() {
    const now = performance.now();
    if (now - this.lastUpdate >= this.interval) {
      this.time++;
      this.timerElement.innerText = `Timer: ${this.time}s`; // Update UI
      this.interval *= 1; // Increase delay gradually
      this.lastUpdate = now;
    }
  }
}
