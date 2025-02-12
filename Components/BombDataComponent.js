export default class BombDataComponent {
  constructor() {
    this.bombData = [];
    this.explosionRange = 2;
    this.timer = 3;
    this.timerInterval = 1000;
  }

  setExplosionRange(n) {
    this.explosionRange = n;
  }
}
