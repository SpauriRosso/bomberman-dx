// import BombSystem from "../systems/BombSystem.js";
import { tileMapDefault, tileTypes } from "../utils/tileMap.js";

export default class InputComponent {
  constructor(playerId, spriteComponent, positionComponent) {
    this.playerId = playerId;
    this.spriteComponent = spriteComponent;
    this.positionComponent = positionComponent;
    this.tileMap = tileMapDefault;
    this.tileTypes = tileTypes;
    this.x = 0;
    this.y = 0;
    this.keys = new Set();
    this.directionMap = this.spriteComponent.animation;
    this.bombActive = false;
    this.bombElement = null;
    this.explosionElement = null;

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

    // Check for collision with the bomb hitbox
    if (this.bombHitboxElement) {
      const bombHitboxX = parseInt(this.bombHitboxElement.style.left) || 0;
      const bombHitboxY = parseInt(this.bombHitboxElement.style.top) || 0;
      const playerX = this.positionComponent.x + 16;
      const playerY = this.positionComponent.y + 16;

      if (
        playerX + 32 > bombHitboxX &&
        playerX < bombHitboxX + 60 &&
        playerY + 32 > bombHitboxY &&
        playerY < bombHitboxY + 60
      ) {
        console.log("Player collided with bomb hitbox!");
      }
    }
  }

  //------------------ create the bomb ----------------------------//
  createBomb() {
    if (this.bombActive) return;

    const bombElement = document.createElement("div");
    bombElement.classList.add("bomb");

    const playerElement = document.getElementById(this.playerId);
    if (playerElement) {
      // Snap bomb position to grid (assuming 64px grid)
      const gridSize = 64;
      const bombSize = 48;

      // Calculate the grid cell position
      const gridX =
        Math.floor((this.positionComponent.x + 16) / gridSize) * gridSize;
      const gridY =
        Math.floor((this.positionComponent.y + 16) / gridSize) * gridSize;

      // Calculate the offset to center the bomb in the grid cell
      const offsetX = (gridSize - bombSize) / 2;
      const offsetY = (gridSize - bombSize) / 2;

      // Position the bomb with the centering offset
      bombElement.style.top = `${gridY + offsetY}px`;
      bombElement.style.left = `${gridX + offsetX}px`;

      bombElement.style.backgroundImage = "url('./pictures/bomb.png')";
      bombElement.style.backgroundSize = "cover";
      bombElement.style.width = "50px";
      bombElement.style.height = "50px";
    }

    // Create bomb hitbox that's completely unwalkable
    const bombHitboxElement = document.createElement("div");
    bombHitboxElement.classList.add("bomb-hitbox");
    bombHitboxElement.style.width = "64px";
    bombHitboxElement.style.height = "64px";
    bombHitboxElement.style.position = "absolute";
    bombHitboxElement.style.border = "1px solid red";

    // Position the hitbox to block the entire grid cell
    // The hitbox stays aligned to the grid without offset
    bombHitboxElement.style.top = `${
      Math.floor((this.positionComponent.x + 16) / 64) * 64
    }px`;
    bombHitboxElement.style.left = `${
      Math.floor((this.positionComponent.y + 16) / 64) * 64
    }px`;

    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.appendChild(bombElement);
      gameContainer.appendChild(bombHitboxElement);
    }

    this.bombActive = true;
    this.bombElement = bombElement;
    this.bombHitboxElement = bombHitboxElement;

    setTimeout(() => {
      this.createExplosion(bombElement);
      gameContainer.removeChild(bombElement);
      gameContainer.removeChild(bombHitboxElement);
      this.bombActive = false;
    }, 3000);
  }
  //------------------ create the explosion ----------------------------//
  createExplosion(bombElement) {
    console.log("Creating explosion...");

    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) return;

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

    // Create explosion elements
    explosionCoords.forEach((coord) => {
      // Create visual explosion effect
      const explosionElement = document.createElement("div");
      explosionElement.classList.add("explosion");
      explosionElement.style.left = `${coord.x * 64}px`;
      explosionElement.style.top = `${coord.y * 64}px`;
      explosionElement.style.backgroundImage =
        "url('./pictures/explosion.png')";
      explosionElement.style.backgroundSize = "cover";
      explosionElement.style.width = "60px";
      explosionElement.style.height = "60px";
      explosionElement.style.position = "absolute";
      gameContainer.appendChild(explosionElement);

      // Handle tile destruction
      const tileElements = gameContainer.querySelectorAll(".tile");
      tileElements.forEach((tile, index) => {
        const tileX = index % tileMapDefault[0].length;
        const tileY = Math.floor(index / tileMapDefault[0].length);

        if (tileX === coord.x && tileY === coord.y) {
          // Check if this is a breakable tile
          if (tileMapDefault[tileY][tileX] === 2) {
            console.log(`Breaking tile at ${tileY}, ${tileX}`);
            // Update the tile map
            tileMapDefault[tileY][tileX] = 0;
            this.tileMap = [...tileMapDefault]; // Update tileMap array
            // Update tile appearance
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

    // Clean up explosions after animation
    setTimeout(() => {
      console.log("Removing explosion elements...");
      gameContainer.querySelectorAll(".explosion").forEach((explosion) => {
        gameContainer.removeChild(explosion);
      });
    }, 1000);
  }
}
