import { tileMapDefault, tileTypes } from "../utils/tileMap.js";

export default class InputComponent {
  constructor(playerId, spriteComponent, velocityComponent) {
    this.playerId = playerId;
    this.spriteComponent = spriteComponent;
    this.velocityComponent = velocityComponent;
    this.tileMap = tileMapDefault;
    this.tileTypes = tileTypes;
    this.x = 0;
    this.y = 0;
    this.keys = new Set();
    this.directionMap = this.spriteComponent.animation;
    this.bombActive = false;
    this.bombElement = null;
    this.explosionElement = null;

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    this.animate(spriteComponent);
  }

  handleKeyDown(e) {
    if (!this.directionMap.hasOwnProperty(e.key));

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
    if (!this.directionMap.hasOwnProperty(e.key));

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

    this.velocityComponent.vy = 0;
    this.velocityComponent.vx = 0;

    if (
      (this.keys.has("q") || this.keys.has("ArrowLeft")) &&
      (this.keys.has("d") || this.keys.has("ArrowRight"))
    ) {
      this.velocityComponent.vx = 0;
    } else if (
      (this.keys.has("z") || this.keys.has("ArrowUp")) &&
      (this.keys.has("s") || this.keys.has("ArrowDown"))
    ) {
      this.velocityComponent.vy = 0;
    } else if (this.keys.has("q") || this.keys.has("ArrowLeft")) {
      this.velocityComponent.vx = -this.spriteComponent.speed;
    } else if (this.keys.has("d") || this.keys.has("ArrowRight")) {
      this.velocityComponent.vx = this.spriteComponent.speed;
    } else if (this.keys.has("z") || this.keys.has("ArrowUp")) {
      this.velocityComponent.vy = -this.spriteComponent.speed;
    } else if (this.keys.has("s") || this.keys.has("ArrowDown")) {
      this.velocityComponent.vy = this.spriteComponent.speed;
    }
    if (this.keys.has(" ") || this.keys.has("Spacebar")) {
      this.createBomb();
      console.log("Spacebar pressed", "bomb placed");
    }

    // Check for collision with the bomb hitbox
    if (this.bombHitboxElement) {
      const bombHitboxX = parseInt(this.bombHitboxElement.style.left) || 0;
      const bombHitboxY = parseInt(this.bombHitboxElement.style.top) || 0;
      const playerX = this.positionComponent?.x + 16;
      const playerY = this.positionComponent?.y + 16;

      if (
        playerX + 32 > bombHitboxX &&
        playerX < bombHitboxX + 60 &&
        playerY + 32 > bombHitboxY &&
        playerY < bombHitboxY + 60
      ) {
        console.log("Player collided with bomb hitbox!");
      }
    }

    if (this.velocityComponent.vx !== 0 || this.velocityComponent.vy !== 0) {
      this.spriteComponent.isMoving = true;
    } else {
      this.spriteComponent.isMoving = false;
    }
  }
  //------------------ create the bomb ----------------------------//
  createBomb() {
    if (this.bombActive) return;

    const bombImages = [
      "url('./pictures/bomb_sprite/bomb1.png')",
      "url('./pictures//bomb_sprite/bomb2.png')",
      "url('./pictures//bomb_sprite/bomb3.png')",
    ];

    const Bombplant = new Audio(
      "./pictures/bomb_sprite/Bomb_sound/heavy_splash.ogg"
    );
    Bombplant.play();

    const bombElement = document.createElement("div");
    bombElement.classList.add("bomb");

    const playerElement = document.getElementById(this.playerId);
    if (playerElement) {
      // Get the player's position
      const playerX = playerElement.offsetLeft;
      const playerY = playerElement.offsetTop;

      // Snap bomb position to grid (assuming 64px grid)
      const bombSize = 32;
      const gridSize = 64;

      // Calculate the grid cell position
      const gridX = Math.floor((playerX + 15) / gridSize) * gridSize;
      const gridY = Math.floor((playerY + 15) / gridSize) * gridSize;

      // Calculate the offset to center the bomb in the grid cell
      const offsetX = (gridSize - bombSize) / 2;
      const offsetY = (gridSize - bombSize) / 2;

      // Position the bomb with the centering offset
      bombElement.style.top = `${gridY + offsetY + 2}px`;
      bombElement.style.left = `${gridX + offsetX + 2}px`;

      bombElement.style.backgroundSize = "cover";
      bombElement.style.width = "50px";
      bombElement.style.height = "50px";

      // Create bomb hitbox that's completely unwalkable
      const bombHitboxElement = document.createElement("div");
      bombHitboxElement.classList.add("bomb-hitbox");
      bombHitboxElement.style.width = "64px";
      bombHitboxElement.style.height = "64px";
      bombHitboxElement.style.position = "absolute";
      bombHitboxElement.style.border = "1px solid red";

      // Position the hitbox to block the entire grid cell - fixed positioning
      bombHitboxElement.style.top = `${gridY + offsetY - 7}px`;
      bombHitboxElement.style.left = `${gridX + offsetX - 7}px`;

      const gameContainer = document.getElementById("game-container");
      if (gameContainer) {
        gameContainer.appendChild(bombElement);
        gameContainer.appendChild(bombHitboxElement);
      }

      this.bombActive = true;
      this.bombElement = bombElement;
      this.bombHitboxElement = bombHitboxElement;

      // Create a counter to cycle through the bomb images
      let bombImageIndex = 0;

      // Create an interval to update the bomb image
      const bombInterval = setInterval(() => {
        bombElement.style.backgroundImage = bombImages[bombImageIndex];
        bombImageIndex = (bombImageIndex + 1) % bombImages.length;
      }, 95); // Update the bomb image every 95ms

      // Clear the interval when the bomb explodes
      setTimeout(() => {
        clearInterval(bombInterval);
        this.createExplosion(bombElement);
        gameContainer.removeChild(bombElement);
        gameContainer.removeChild(bombHitboxElement);
        this.bombActive = false;
      }, 3000);
    }
  }

  //------------------ create the explosion ----------------------------//
  createExplosion(bombElement) {
    console.log("Creating explosion...");

    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) return;

    const explosionSound = new Audio(
      "./pictures/bomb_sprite/Bomb_sound/8bit_bomb_explosion.wav"
    );
    explosionSound.play();

    // Calculate bomb position in grid coordinates
    const bombX = Math.floor((parseInt(bombElement.style.left) || 0) / 64);
    const bombY = Math.floor((parseInt(bombElement.style.top) || 0) / 64);

    // Define explosion pattern (center + cardinal directions)
    const explosionCoords = [
      { x: bombX, y: bombY }, // Center
      { x: bombX, y: bombY - 1 }, // North
      { x: bombX, y: bombY + 1 }, // South
      { x: bombX - 1, y: bombY }, // West
      { x: bombX + 1, y: bombY }, // East
    ];

    const explosionElements = [];
    const explosionHitboxes = [];

    // Create explosion elements
    explosionCoords.forEach((coord) => {
      // Create visual explosion effect
      const explosionElement = document.createElement("div");
      explosionElement.classList.add("explosion");
      explosionElement.style.left = `${coord.x * 64 + 7}px`; // +2px offset to center within hitbox
      explosionElement.style.top = `${coord.y * 64 + 7}px`; // +2px offset to center within hitbox
      explosionElement.style.backgroundImage =
        "url('./pictures/explosion.png')";
      explosionElement.style.backgroundSize = "cover";
      explosionElement.style.width = "60px";
      explosionElement.style.height = "60px";
      explosionElement.style.position = "absolute";

      // Create explosion hitbox
      const hitboxElement = document.createElement("div");
      hitboxElement.classList.add("explosion-hitbox");
      hitboxElement.style.position = "absolute";
      hitboxElement.style.left = `${coord.x * 64 + 2}px`;
      hitboxElement.style.top = `${coord.y * 64 + 2}px`;
      hitboxElement.style.width = "64px";
      hitboxElement.style.height = "64px";
      hitboxElement.style.border = "1px solid red";

      hitboxElement.style.zIndex = "1"; // Place hitbox behind explosion sprite

      // Add elements to the game container
      gameContainer.appendChild(hitboxElement);
      gameContainer.appendChild(explosionElement);

      explosionElements.push(explosionElement);
      explosionHitboxes.push(hitboxElement);

      // Handle tile destruction
      const tileElements = gameContainer.querySelectorAll(".tile");
      tileElements.forEach((tile, index) => {
        const tileX = index % tileMapDefault[0].length;
        const tileY = Math.floor(index / tileMapDefault[0].length);

        if (tileX === coord.x && tileY === coord.y) {
          if (tileMapDefault[tileY][tileX] === 2) {
            console.log(`Breaking tile at ${tileY}, ${tileX}`);
            tileMapDefault[tileY][tileX] = 0;
            this.tileMap = [...tileMapDefault];
            tile.classList.remove("breakable");
            tile.classList.add("floor");
          }
        }
      });

      // Check for other collisions (players, enemies)
      const hitElements = gameContainer.querySelectorAll(".player, .enemy");
      hitElements.forEach((hitElement) => {
        const elementX = Math.floor(
          (parseInt(hitElement.style.left) || 0) / 64
        );
        const elementY = Math.floor((parseInt(hitElement.style.top) || 0) / 64);

        if (elementX === coord.x && elementY === coord.y) {
          console.log(
            `Explosion hit ${hitElement.classList[0]} at ${elementX}, ${elementY}`
          );
          // Handle player/enemy collision logic here
        }
      });
    });

    // Clean up explosions and hitboxes after animation
    setTimeout(() => {
      console.log("Removing explosion elements...");
      explosionElements.forEach((element) =>
        gameContainer.removeChild(element)
      );
      explosionHitboxes.forEach((hitbox) => gameContainer.removeChild(hitbox));
    }, 1000);
  }
}
