class LivesComponent {
  constructor(initialLives) {
    this.lives = initialLives;
  }

  loseLife() {
    this.lives -= 1;
  }

  triggerGameOver() {
    alert("Game Over!");
    // Logique supplémentaire pour gérer le game over
  }
}

export default LivesComponent;
