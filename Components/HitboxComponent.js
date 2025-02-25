export default class HitboxComponent {
  constructor() {
    this.width = 45;  // Même valeur que dans CollisionSystem.js
    this.height = 45; // Même valeur que dans CollisionSystem.js
    this.offsetX = (64 - this.width) / 2; // Centrage horizontal
    this.offsetY = (64 - this.height) / 2; // Centrage vertical
  }
}

