class ScoreManager {
  constructor(hudHeader) {
    this.score = 0;
    this.highScore = this.loadHighScore();
<<<<<<< HEAD
    this.hudHeader = hudHeader;
    this.updateScoreDisplay();
    this.updateHighScoreDisplay();
=======
    this.initScoreDisplay();
  }

  initScoreDisplay() {
    const scoreContainer = document.createElement("div");
    scoreContainer.className = "score-container";
>>>>>>> b2041b7a1d67dc33f8df7abe2d9aff322fc69055
  }

  updateScoreDisplay() {
    this.hudHeader.updateScore(this.score);
  }

  updateHighScoreDisplay() {
    // Mettre à jour l'affichage du high score si nécessaire
  }

  // Points for different game events
<<<<<<< HEAD
  addBoxPoints() {
    console.log("scoreboxadded");
    this.updateScore(10); // 10 points for destroying a box
  }

  addEnemyPoints() {
    this.updateScore(300); // 300 points for defeating an enemy
=======
  addEnemyDefeatPoints() {
    this.updateScore(300); // 100 points for defeating an enemy
  }

  addBreakablePoints() {
    this.updateScore(10); // 50 points for destroying a block
>>>>>>> b2041b7a1d67dc33f8df7abe2d9aff322fc69055
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
