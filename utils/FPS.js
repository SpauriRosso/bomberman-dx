export default class FPS {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = 0;
    this.targetFPS = 60;

    this.fpsElement = document.createElement("div");
    this.fpsElement.style.position = "fixed";
    this.fpsElement.style.top = "10px";
    this.fpsElement.style.right = "10px";
    this.fpsElement.style.fontSize = "24px";
    this.fpsElement.style.fontWeight = "bold";
    this.fpsElement.style.color = "white";
    this.fpsElement.style.background = "rgba(0, 0, 0, 0.5)";
    this.fpsElement.style.padding = "5px";
    this.fpsElement.style.borderRadius = "5px";
    this.fpsElement.style.cursor = "default";
    document.body.appendChild(this.fpsElement);
  }

  update(time) {
    this.frameCount++;
    if (time - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = time;
    }
    this.fpsElement.innerText = `${this.fps}`;
  }
}
