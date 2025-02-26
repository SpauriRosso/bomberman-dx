export default class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.initScoreDisplay();
        this.hudHeader = null;
    }

    setHUD(hudHeader) {
        this.hudHeader = hudHeader;
        this.updateScoreDisplay();
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
    addEnemyDefeatPoints() {
        this.updateScore(Math.floor(Math.random() * (200 - 150 + 1)) + 150);
    }

    addBreakablePoints() {
        this.updateScore(Math.floor(Math.random() * (10 - 5 + 1)) + 5);
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
    // updateScore(points) {
    //   this.score += points;
    //   this.updateScoreDisplay();
    //   this.checkHighScore();
    // }
    updateScore(points) {
        this.score += points;
        console.log(`Score updated: ${this.score}`);

        if (this.hudHeader) {
            this.hudHeader.updateScore(this.score);
            this.updateScoreDisplay();
        }

        this.checkHighScore();
    }
}
