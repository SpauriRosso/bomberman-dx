class ScoreManager {
  constructor(hudHeader) {
    this.score = 0;
    this.hudHeader = hudHeader;
    this.highScore = this.loadHighScore();
    this.initScoreDisplay();
  }

  initScoreDisplay() {
    const scoreContainer = document.createElement("div");
    scoreContainer.className = "score-container";
  }

  updateScoreDisplay() {
    const currentScoreElement = document.getElementById("current-score");
    if (currentScoreElement) {
      currentScoreElement.textContent = this.score.toString();
    }
  }

  updateHighScoreDisplay() {
    const highScoreElement = document.getElementById("high-score");
    if (highScoreElement) {
      highScoreElement.textContent = this.highScore.toString();
    }
  }

  // Points for different game events
  addBoxPoints() {
    this.updateScore(10); // 10 points for destroying a box
  }

  addEnemyPoints() {
    this.updateScore(300); // 300 points for defeating an enemy
  }

  // Manage high score
  checkHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  // Save high score to local storage
  saveHighScore() {
    try {
      localStorage.setItem("bombermanHighScore", this.highScore.toString());
    } catch (error) {
      console.error("Could not save high score:", error);
    }
  }

  // Load high score from local storage
  loadHighScore() {
    try {
      return parseInt(localStorage.getItem("bombermanHighScore")) || 0;
    } catch (error) {
      console.error("Could not load high score:", error);
      return 0;
    }
  }

  // Reset score for new game
  resetScore() {
    this.score = 0;
    this.updateScoreDisplay();
  }

  // Get current score
  getScore() {
    return this.score;
  }

  // Get high score
  getHighScore() {
    return this.highScore;
  }

  // Update score
  updateScore(points) {
    this.score += points;
    this.updateScoreDisplay();
    this.checkHighScore();
  }
}

export default ScoreManager;
