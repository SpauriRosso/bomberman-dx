class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.initScoreDisplay();
  }

  // Display Methods
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

  // Score Management Methods
  addEnemyDefeatPoints() {
    this.updateScore(100); // 100 points for defeating an enemy
  }

  addDestructibleBlockPoints() {
    this.updateScore(50); // 50 points for destroying a block
  }

  addPowerUpPoints() {
    this.updateScore(200); // 200 points for collecting a power-up
  }

  // Local Storage Methods
  checkHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  saveHighScore() {
    try {
      localStorage.setItem("bombermanHighScore", this.highScore.toString());
    } catch (error) {
      console.error("Could not save high score:", error);
    }
  }

  loadHighScore() {
    try {
      return parseInt(localStorage.getItem("bombermanHighScore")) || 0;
    } catch (error) {
      console.error("Could not load high score:", error);
      return 0;
    }
  }

  // Reset and Getter Methods
  resetScore() {
    this.score = 0;
    this.updateScoreDisplay();
  }

  getScore() {
    return this.score;
  }

  getHighScore() {
    return this.highScore;
  }

  updateScore(points) {
    this.score += points;
    this.updateScoreDisplay();
    this.checkHighScore();
  }
}

// Create a global instance of ScoreManager
const scoreManager = new ScoreManager();

// Export for potential module use
export default scoreManager;
