import RenderSystem from "../systems/RenderSystem.js";
export default class InputComponent {
  constructor(playerId, spriteComponent) {
    this.playerId = playerId;
    this.spriteComponent = spriteComponent;
    this.x = 0;
    this.y = 0;
    this.keys = new Set();
    this.directionMap = this.spriteComponent.animation;
    this.animate(spriteComponent);
    this.lastPauseUpdate = Date.now();
    this.isPaused = false;

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    if (!this.directionMap.hasOwnProperty(e.key)) return;

    let spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    this.keys.add(e.key);

    if (!spriteComponent.isMoving) {
      spriteComponent.isMoving = true;
      spriteComponent.frameIndex = 0; // Commence à la frame 0
    }

    // Met à jour la direction de la sprite sheet
    spriteComponent.direction = this.directionMap[e.key];
  }

  handleKeyUp(e) {
    if (!this.directionMap.hasOwnProperty(e.key)) return;

    let spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    this.keys.delete(e.key);

    if (this.keys.size === 0) {
      spriteComponent.isMoving = false;
      spriteComponent.frame = 0;
      const posX = -spriteComponent.frame * spriteComponent.frameWidth;
      const posY = -spriteComponent.direction * spriteComponent.frameHeight;

      const playerElement = document.getElementById(this.playerId);
      if (playerElement) {
        playerElement.style.backgroundPosition = `${posX}px ${posY}px`;
      }
    }
  }

  togglePause() {
    const now = Date.now()
    if (now - this.lastPauseUpdate > 100) {
      if (!this.isPaused) {
        this.isPaused = true;
        this.displayPause()
        this.lastPauseUpdate = now
      } else {
        this.isPaused = false;
        this.removePause()
        this.lastPauseUpdate = now;
      }
    }
  }

  // displayPause() {
  //   const pauseScreen = document.createElement("div");
  //   pauseScreen.id = "pauseScreen";
  //   pauseScreen.style.position = "absolute";
  //   pauseScreen.style.width = "100%";
  //   pauseScreen.style.height = "100%";
  //   pauseScreen.style.background = "rgba(0,0,0,0.5)";
  //   pauseScreen.style.color = "white";
  //   pauseScreen.style.display = "flex";
  //   pauseScreen.style.justifyContent = "center";
  //   pauseScreen.style.alignItems = "center";
  //   pauseScreen.style.fontSize = "3em";
  //   pauseScreen.innerHTML = "PAUSE";
  //   document.getElementById("gameGrid").appendChild(pauseScreen);
  // }

  displayPause() {
    const pauseScreen = document.createElement("div");
    pauseScreen.id = "pauseScreen";
    pauseScreen.style.position = "absolute";
    pauseScreen.style.background = "rgba(0,0,0,0.5)";
    pauseScreen.style.color = "white";
    pauseScreen.style.display = "flex";
    pauseScreen.style.justifyContent = "center";
    pauseScreen.style.alignItems = "center";
    pauseScreen.style.fontSize = "3em";
    pauseScreen.style.top = "50%";
    pauseScreen.style.left = "50%";
    pauseScreen.style.transform = "translate(-50%, -50%)";
    pauseScreen.style.width = "292px";
    pauseScreen.style.height = "135px";
    pauseScreen.style.background = "rgba(209, 196, 233, 0.29)";
    pauseScreen.style.borderRadius = "10px";
    pauseScreen.style.border = "1px solid #ffffff";
    pauseScreen.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.5)";
    pauseScreen.style.backdropFilter = "blur(29px)";
    pauseScreen.style.display = "flex";
    pauseScreen.style.flexDirection = "column";
    pauseScreen.style.alignItems = "center";
    pauseScreen.style.justifyContent = "center";
    pauseScreen.style.padding = "15px";
    pauseScreen.style.zIndex = "1000";

    const pauseText = document.createElement("div");
    pauseText.innerText = "PAUSE";
    pauseText.style.color = "#ffffff";
    pauseText.style.fontFamily = "Inter, sans-serif";
    pauseText.style.fontSize = "48px";
    pauseText.style.fontWeight = "500";
    pauseText.style.textShadow = "0px 4px 4px rgba(0, 0, 0, 0.25)";
    pauseScreen.appendChild(pauseText);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "20px";
    buttonContainer.style.marginTop = "20px";

    const pauseButton = document.createElement("img");
    pauseButton.src = "pictures/Pause-Button.png";
    pauseButton.style.width = "49px";
    pauseButton.style.height = "49px";
    pauseButton.style.cursor = "pointer";
    pauseButton.addEventListener("click", () => this.togglePause());

    const resetButton = document.createElement("img");
    resetButton.src = "pictures/Reset.png";
    resetButton.style.width = "49px";
    resetButton.style.height = "49px";
    resetButton.style.cursor = "pointer";
    resetButton.addEventListener("click", () => window.location.reload());

    const closeButton = document.createElement("img");
    closeButton.src = "pictures/Cancel.png";
    closeButton.style.width = "49px";
    closeButton.style.height = "49px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => this.togglePause());

    buttonContainer.appendChild(pauseButton);
    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(closeButton);
    pauseScreen.appendChild(buttonContainer);
    document.getElementById("gameGrid").appendChild(pauseScreen);
  }

  removePause() {
    const pauseScreen = document.getElementById("pauseScreen");
    if (pauseScreen) {
      pauseScreen.remove();
    }
  }

  animate(sC) {
    setInterval(() => {
      if (!sC.isMoving) return;
      // Alterne entre frame 0 → 1 → 2 en boucle
      sC.frame = sC.frameSequence[sC.frameIndex];
      sC.frameIndex = (sC.frameIndex + 1) % sC.frameSequence.length; // Boucle sur 0 → 1 → 2 → 0 → 1 → 2...

      const posX = -sC.frame * sC.frameWidth;
      const posY = -sC.direction * sC.frameHeight;
      const playerElement = document.getElementById(this.playerId);
      if (playerElement) {
        playerElement.style.backgroundPosition = `${posX}px ${posY}px`;
      }
    }, 150);
  }

  update() {
    let spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    document.addEventListener("keypress", (e) => {
      if (e.key === "p") {
        this.togglePause();
      }
    })

    if (this.isPaused) {
      this.x = 0;
      this.y = 0;
      return;
    }

    this.x = 0;
    this.y = 0;

    if (this.keys.has("q") || this.keys.has("ArrowLeft")) {
      this.x = -spriteComponent.speed;
    }
    if (this.keys.has("d") || this.keys.has("ArrowRight")) {
      this.x = spriteComponent.speed;
    }
    if (this.keys.has("z") || this.keys.has("ArrowUp")) {
      this.y = -spriteComponent.speed;
    }
    if (this.keys.has("s") || this.keys.has("ArrowDown")) {
      this.y = spriteComponent.speed;
    }

    if (this.x !== 0 || this.y !== 0 && isPaused === false) {
      this.spriteComponent.isMoving = true;
    } else {
      this.spriteComponent.isMoving = false;
    }
  }
}
