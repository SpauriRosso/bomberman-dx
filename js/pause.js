class Pause {
  constructor() {
    this.pauseMenu = document.getElementById("pause-menu");
    this.resumeButton = document.getElementById("resume-btn");
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.togglePause();
      }
    });
  }

  togglePause() {
    this.pauseMenu.classList.toggle("hidden");
    Game.toggleGameState();
  }
}
