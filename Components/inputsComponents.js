export default class InputComponent {
  constructor(playerId, spriteComponent, positionComponent) {
    this.playerId = playerId;
    this.spriteComponent = spriteComponent;
    this.positionComponent = positionComponent;
    this.x = 0;
    this.y = 0;
    this.keys = new Set();
    this.directionMap = this.spriteComponent.animation;
    this.directionMap = this.spriteComponent.animation;
    this.bombActive = false;

    this.animate(spriteComponent);

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    if (!this.directionMap.hasOwnProperty(e.key)); //return;

    let spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    this.keys.add(e.key);

    console.log(`Key pressed: ${e.key}`);

    if (!spriteComponent.isMoving) {
      spriteComponent.isMoving = true;
      spriteComponent.frameIndex = 0; // Commence à la frame 0
    }

    // Met à jour la direction de la sprite sheet
    spriteComponent.direction = this.directionMap[e.key];
  }

  handleKeyUp(e) {
    if (!this.directionMap.hasOwnProperty(e.key)); //return;

    let spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    this.keys.delete(e.key);
    console.log(`Key pressed: ${e.key}`);

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
    if (this.keys.has(" ") || this.keys.has("Spacebar")) {
      this.createBomb();
      console.log("Spacebar pressed", "bomb placed");
    }

    if (this.x !== 0 || this.y !== 0) {
      this.spriteComponent.isMoving = true;
    } else {
      this.spriteComponent.isMoving = false;
    }
  }

  //------------------ create the bomb ---------------------------- //
  createBomb() {
    if (this.bombActive) return; // Prevent multiple bombs from being spawned

    // Create a new bomb element
    const bombElement = document.createElement("div");
    bombElement.classList.add("bomb");

    // Set the bomb's position to the player's position
    const playerElement = document.getElementById(this.playerId);
    if (playerElement) {
      bombElement.style.top = `${this.positionComponent.y + 16}px`;
      bombElement.style.left = `${this.positionComponent.x + 16}px`;

      // Set the bomb's background image
      bombElement.style.backgroundImage = "url('./pictures/bomb.png')"; // Replace 'bomb.png' with the actual path to your bomb image
      bombElement.style.backgroundSize = "cover"; // Ensure the image covers the entire bomb element
      bombElement.style.width = "40px"; // Set the width of the bomb element to match the image size
      bombElement.style.height = "40px"; // Set the height of the bomb element to match the image size
    }

    // Add the bomb element to the game container
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.appendChild(bombElement);
    }

    this.bombActive = true; // Set the bomb active flag

    // Add a timeout to create the explosion after 3 seconds
    setTimeout(() => {
      this.createExplosion(bombElement);
      gameContainer.removeChild(bombElement);
      this.bombActive = false; // Reset the bomb active flag
    }, 3000); // Create the explosion after 3 seconds
  }
  //------------------ create the explosion ---------------------------- //
  createExplosion(bombElement) {
    console.log("Creating explosion...");

    // Create a new explosion element
    const explosionElement = document.createElement("div");
    explosionElement.classList.add("explosion");

    // Set the explosion's position to the bomb's position
    explosionElement.style.top = bombElement.style.top;
    explosionElement.style.left = bombElement.style.left;

    // Set the explosion's background image
    explosionElement.style.backgroundImage = "url('./pictures/explosion.png')"; // Replace 'explosion.png' with the actual path to your explosion image
    explosionElement.style.backgroundSize = "cover"; // Ensure the image covers the entire explosion element
    explosionElement.style.width = "40px"; // Set the width of the explosion element to match the image size
    explosionElement.style.height = "40px"; // Set the height of the explosion element to match the image size

    // Add the explosion element to the game container
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.appendChild(explosionElement);
      console.log("Explosion element added to game container.");
    }

    // Add a timeout to remove the explosion after a certain time
    setTimeout(() => {
      console.log("Removing explosion element...");
      gameContainer.removeChild(explosionElement);
    }, 1000); // Remove the explosion after 1 second
  }
}
