export default class LifeComponent {
  constructor(initialLives) {
    this.lives = initialLives; // Track the number of lives
  }

  loseLife() {
    if (this.lives > 0) {
      this.lives -= 1; // Decrease the number of lives
      if (this.lives <= 0) {
        this.triggerGameOver(); // Trigger game over if no lives left
      }
    }
  }

  triggerGameOver() {
    console.log("Game Over!"); // Replace with actual game over logic
    // You can also trigger an event or call a method in your game manager
  }
}
