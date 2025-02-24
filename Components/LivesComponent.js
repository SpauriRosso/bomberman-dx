import gameStateEntity from "../entities/GameStateEntity.js";

export default class LifeComponent {
  constructor(initialLives, gameStateEntity) {
    this.lives = initialLives; // Track the number of lives
    this.isInvincible = false; // Prevents taking multiple hits from a single explosion
    this.gameStateEntity = gameStateEntity; // Reference to the game state entity

    // Create and initialize the life counter display
    this.createLifeCounter();
    this.updateLifeCounter();
  }

  createLifeCounter() {
    // Check if a life counter already exists to avoid duplicates
    if (document.getElementById("lifeCounter")) return;

    // Create container for life counter
    const lifeCounter = document.createElement("div");
    lifeCounter.id = "lifeCounter";
    lifeCounter.style.position = "absolute";
    lifeCounter.style.top = "-50px";
    lifeCounter.style.left = "10px";
    lifeCounter.style.display = "flex";
    lifeCounter.style.alignItems = "center";
    lifeCounter.style.gap = "10px";
    lifeCounter.style.zIndex = "100";

    // Create heart icon or label
    const heartIcon = document.createElement("img");
    heartIcon.src = "./pictures/heart.png"; // Path to your heart icon
    heartIcon.style.width = "40px";
    heartIcon.style.height = "40px";
    heartIcon.alt = "Lives";

    // Add heartbeat animation
    heartIcon.style.animation = "heartbeat 1s infinite";

    // Fallback to text if image doesn't load
    heartIcon.onerror = function () {
      this.outerHTML = `<span style="color: red; font-size: 32px; animation: heartbeat 1s infinite;">❤</span>`;
    };

    // Create life count text
    const lifeCount = document.createElement("span");
    lifeCount.id = "lifeCountText";
    lifeCount.style.color = "#ffffff";
    lifeCount.style.fontFamily = "bomberman";
    lifeCount.style.fontSize = "32px";
    lifeCount.style.fontWeight = "500";
    lifeCount.style.textShadow = "0px 2px 2px rgba(0, 0, 0, 0.5)";

    // Assemble the counter
    lifeCounter.appendChild(heartIcon);
    lifeCounter.appendChild(lifeCount);

    // Add to the game grid
    document.getElementById("gameGrid").appendChild(lifeCounter);

    // Append the heartbeat animation style to the document
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes heartbeat {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  updateLifeCounter() {
    const lifeCountText = document.getElementById("lifeCountText");
    if (lifeCountText) {
      lifeCountText.textContent = `${this.lives}`;
    }
  }

  loseLife() {
    if (this.isInvincible) return; // If invincible, ignore damage

    if (this.lives > 0) {
      this.lives -= 1;
      console.log(`Player lost a life! ${this.lives} lives remaining.`);

      // Update the life counter display
      this.updateLifeCounter();

      // Add visual feedback
      this.flashLifeCounter();

      // Make the player flash 3 times
      // this.flashPlayer();

      this.isInvincible = true; // Activate invincibility to prevent multiple hits
      setTimeout(() => {
        this.isInvincible = false; // Reset invincibility after 1 second
      }, 1000);

      if (this.lives <= 0) {
        this.triggerGameOver();
      }
    }
  }
  // flashPlayer() {
  //   // We need to find the player element - assuming it has an id or class
  //   const player = document.querySelector(".player"); // Adjust this selector based on your player element

  //   if (player) {
  //     // Make sure the flash animation style exists
  //     if (!document.getElementById("playerFlashAnimation")) {
  //       const style = document.createElement("style");
  //       style.id = "playerFlashAnimation";
  //       style.textContent = `
  //         @keyframes playerFlash {
  //           0%, 33%, 66%, 100% { opacity: 1; }
  //           16.5%, 49.5%, 82.5% { opacity: 0.3; }
  //         }
  //       `;
  //       document.head.appendChild(style);
  //     }

  //     // Apply the flash animation (3 flashes)
  //     player.style.animation = "playerFlash 1s";

  //     // Remove the animation after it completes
  //     setTimeout(() => {
  //       player.style.animation = "";
  //     }, 1000);
  //   }
  // }
  flashLifeCounter() {
    // Add a flashing effect when player loses a life
    const lifeCounter = document.getElementById("lifeCounter");
    if (lifeCounter) {
      lifeCounter.style.animation = "flash 0.5s";

      // Define the flash animation if it doesn't exist
      if (!document.getElementById("flashAnimation")) {
        const style = document.createElement("style");
        style.id = "flashAnimation";
        style.textContent = `
          @keyframes flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `;
        document.head.appendChild(style);
      }

      // Remove the animation after it completes
      setTimeout(() => {
        lifeCounter.style.animation = "";
      }, 500);
    }
  }

  // Add a method to gain lives (for power-ups, etc.)
  gainLife() {
    this.lives += 1;
    console.log(`Player gained a life! ${this.lives} lives remaining.`);
    this.updateLifeCounter();
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
    mainMenuButton.addEventListener(
      "click",
      () => (window.location.href = "mainmenu.html")
    );

    buttonContainer.appendChild(restartButton);
    buttonContainer.appendChild(mainMenuButton);
    gameOverScreen.appendChild(buttonContainer);
    document.getElementById("gameGrid").appendChild(gameOverScreen);
  }

  pauseGame() {
    const pauseComponent = gameStateEntity;
    pauseComponent.isPaused = true;

    document.dispatchEvent(
      new CustomEvent("pauseToggled", {
        detail: { isPaused: true },
      })
    );

    console.log("Game paused due to Game Over.");
  }
}
