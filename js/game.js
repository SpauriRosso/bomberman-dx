class Game {
  static init() {
    this.tilemap = new Tilemap();
    this.player = new Player();
    this.pause = new Pause();
    this.isPaused = false;
  }

  static canMove(x, y) {
    return !Collision.checkCollision(x, y);
  }

  static placeBomb(x, y) {
    if (!this.isPaused) {
      return BombCollision.placeBomb(x, y);
    }
    return false;
  }

  static toggleGameState() {
    this.isPaused = !this.isPaused;
  }
}
function gameLoop() {
  // Game loop logic can be added here
  checkBombCollision(player, bomb);
  requestAnimationFrame(gameLoop);
}
// Initialize the game when the page loads
window.addEventListener("load", () => {
  Game.init();
});
