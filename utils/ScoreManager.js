class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.initScoreDisplay();
  }

  initScoreDisplay() {
    const scoreContainer = document.createElement("div");
    scoreContainer.className = "score-container";
    scoreContainer.innerHTML = `
            <div class="score-label">SCORE</div>
            <div id="current-score" class="score-value">0</div>
            <div class="score-label">HIGH SCORE</div>
            <div id="high-score" class="score-value high-score">0</div>
        `;
    document.body.appendChild(scoreContainer);
    this.updateScoreDisplay();
    this.updateHighScoreDisplay();
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
  addEnemyDefeatPoints() {
    this.updateScore(100); // 100 points for defeating an enemy
  }

  addDestructibleBlockPoints() {
    this.updateScore(50); // 50 points for destroying a block
  }

  addPowerUpPoints() {
    this.updateScore(200); // 200 points for collecting a power-up
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
