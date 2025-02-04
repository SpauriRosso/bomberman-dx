let playerHealth = 100;

class Player {
  constructor(x = 1, y = 1) {
    this.x = x;
    this.y = y;
    this.element = document.getElementById("player");
    this.updatePosition();
    this.bindControls();
    this.bombCount = 1; // Maximum number of bombs player can place
  }

  updatePosition() {
    const tileSize = this.element.parentElement.clientWidth / 15;
    this.element.style.left = `${this.x * tileSize}px`;
    this.element.style.top = `${this.y * tileSize}px`;
  }

  bindControls() {
    window.addEventListener("keydown", (e) => {
      if (Game.isPaused) return; // Prevent movement when game is paused

      switch (e.key) {
        case "ArrowUp":
          if (Game.canMove(this.x, this.y - 1)) this.y--;
          break;
        case "ArrowDown":
          if (Game.canMove(this.x, this.y + 1)) this.y++;
          break;
        case "ArrowLeft":
          if (Game.canMove(this.x - 1, this.y)) this.x--;
          break;
        case "ArrowRight":
          if (Game.canMove(this.x + 1, this.y)) this.x++;
          break;
        case " ":
          // Prevent default space key behavior
          e.preventDefault();

          // Try to place a bomb at current player location
          this.placeBomb();
          break;
      }
      this.updatePosition();
    });
  }

  placeBomb() {
    // Attempt to place a bomb at the current player's location
    const bombPlaced = Game.placeBomb(this.x, this.y);

    // Optional: You could add bomb count management here if needed
    if (bombPlaced) {
      // Could add sound effect or visual indicator
      console.log("Bomb placed at", this.x, this.y);
    }
  }
}
function reduceHealth(damage) {
  playerHealth -= damage;
  if (playerHealth <= 0) {
    console.log("Game Over");
  }
}
