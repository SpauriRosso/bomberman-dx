import gameStateEntity from "../entities/GameStateEntity.js"

export default class LifeComponent {
  constructor(initialLives, gameStateEntity) {
    this.lives = initialLives; // Track the number of lives
    this.isInvincible = false; // Prevents taking multiple hits from a single explosion
    this.gameStateEntity = gameStateEntity; // Reference to the game state entity
  }

  loseLife() {
    if (this.isInvincible) return; // If invincible, ignore damage

    if (this.lives > 0) {
      this.lives -= 1;
      console.log(`Player lost a life! ${this.lives} lives remaining.`);

      this.isInvincible = true; // Activate invincibility to prevent multiple hits
      setTimeout(() => {
        this.isInvincible = false; // Reset invincibility after 1 second
      }, 1000);

      if (this.lives <= 0) {
        this.triggerGameOver();
      }
    }
  }

  triggerGameOver() {
    console.log("Game Over!");
    this.displayGameOver();
    this.pauseGame();
  }

  displayGameOver() {
    // Vérifie s'il existe déjà pour éviter les doublons
    if (document.getElementById("gameOverScreen")) return;

    const gameOverScreen = document.createElement("div");
    gameOverScreen.id = "gameOverScreen";
    gameOverScreen.style.position = "absolute";
    gameOverScreen.style.top = "50%";
    gameOverScreen.style.left = "50%";
    gameOverScreen.style.transform = "translate(-50%, -50%)";
    gameOverScreen.style.width = "auto";
    gameOverScreen.style.height = "auto";
    gameOverScreen.style.background = "rgba(209, 196, 233, 0.29)";
    gameOverScreen.style.borderRadius = "10px";
    gameOverScreen.style.border = "1px solid #ffffff";
    gameOverScreen.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.5)";
    gameOverScreen.style.backdropFilter = "blur(29px)";
    gameOverScreen.style.display = "flex";
    gameOverScreen.style.flexDirection = "column";
    gameOverScreen.style.alignItems = "center";
    gameOverScreen.style.justifyContent = "center";
    gameOverScreen.style.padding = "15px";
    gameOverScreen.style.zIndex = "1000";

    const gameOverText = document.createElement("div");
    gameOverText.innerText = "GAME OVER";
    gameOverText.style.color = "#ffffff";
    gameOverText.style.fontFamily = "bomberman";
    gameOverText.style.fontSize = "48px";
    gameOverText.style.fontWeight = "500";
    gameOverText.style.textShadow = "0px 4px 4px rgba(0, 0, 0, 0.25)";
    gameOverText.style.whiteSpace = "nowrap"; // Empêche le retour à la ligne

    gameOverScreen.appendChild(gameOverText);


    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "20px";
    buttonContainer.style.marginTop = "20px";

    // Bouton pour redémarrer la partie
    const restartButton = document.createElement("img");
    restartButton.src = "./pictures/pause-assests/Reset.png";
    restartButton.style.width = "49px";
    restartButton.style.height = "49px";
    restartButton.style.cursor = "pointer";
    restartButton.addEventListener("click", () => window.location.reload());

    // Bouton pour retourner au menu principal
    const mainMenuButton = document.createElement("img");
    mainMenuButton.src = "./pictures/pause-assests/Cancel.png";
    mainMenuButton.style.width = "49px";
    mainMenuButton.style.height = "49px";
    mainMenuButton.style.cursor = "pointer";
    mainMenuButton.addEventListener("click", () => window.location.href = "mainmenu.html");

    buttonContainer.appendChild(restartButton);
    buttonContainer.appendChild(mainMenuButton);
    gameOverScreen.appendChild(buttonContainer);
    document.getElementById("gameGrid").appendChild(gameOverScreen);
  }

  pauseGame() {
    const pauseComponent = gameStateEntity
    pauseComponent.isPaused = true;

    document.dispatchEvent(
        new CustomEvent("pauseToggled", {
          detail: { isPaused: true },
        })
    );

    console.log("Game paused due to Game Over.");
  }

}
