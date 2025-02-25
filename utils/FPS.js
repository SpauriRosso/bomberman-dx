export default class FPS {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = 0;
    this.targetFPS = 60;
  }

  update(time) {
    this.frameCount++;
    if (time - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = time;
    }
    return this.fps;
  }
}
