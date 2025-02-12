export default class BombDataComponent {
  constructor() {
    this.bombData = [];
    this.explosionRange = 2;
    this.timer = 3;
    this.timerInterval = 1000;
    this.x = 0;
    this.y = 0;
    this.width = 64; // Assuming the bomb is 64x64 pixels
    this.height = 64;
    this.explosionRadius = 2; // The radius of the explosion
    this.explosionTime = 3000; // The time it takes for the bomb to explode (in milliseconds)
  }
  update() {
    // Update the bomb's timer
    this.timer.update();
  }

  explode() {
    // Handle the explosion logic here
    console.log("Bomb exploded!");
  }
  setExplosionRange(n) {
    this.explosionRange = n;
  }
}
