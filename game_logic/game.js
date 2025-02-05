class Game {
  constructor() {
    this.isPaused = false;
    this.pauseMenu = document.getElementById("pauseMenu");
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "escape") {
        this.togglePause();
      }
    });
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  pause() {
    this.isPaused = true;
    this.pauseMenu.style.display = "block";
    // Additional logic to pause the game (e.g., stop timers, animations)
  }

  resume() {
    this.isPaused = false;
    this.pauseMenu.style.display = "none";
    // Additional logic to resume the game (e.g., restart timers, animations)
  }
}

// Initialize the game
const game = new Game();
