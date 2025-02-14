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
    if (this.bombActive) return; // Prevent multiple bombs from being spawned

    // Create a new bomb element
    const bombElement = document.createElement("div");
    bombElement.classList.add("bomb");

    // Set the bomb's position to the player's position
    const playerElement = document.getElementById(this.playerId);
    if (playerElement) {
      const bombX = this.positionComponent.x + 16;
      const bombY = this.positionComponent.y + 16;
      bombElement.style.top = `${bombY}px`;
      bombElement.style.left = `${bombX}px`;

      // Log the bomb position
      console.log(`Bomb placed at position: (${bombX}, ${bombY})`);

      // Set the bomb's background image
      bombElement.style.backgroundImage = "url('./pictures/bomb.png')";
      bombElement.style.backgroundSize = "cover"; // Ensure the image covers the entire bomb element
      bombElement.style.width = "40px"; // Set the width of the bomb element to match the image size
      bombElement.style.height = "40px"; // Set the height of the bomb element to match the image size
    }

    // Create a new bomb hitbox element
    const bombHitboxElement = document.createElement("div");
    bombHitboxElement.classList.add("bomb-hitbox");
    bombHitboxElement.style.width = "64px"; // Set the width of the hitbox to be slightly larger than the bomb
    bombHitboxElement.style.height = "64px"; // Set the height of the hitbox to be slightly larger than the bomb
    bombHitboxElement.style.position = "absolute";
    bombHitboxElement.style.border = "1px solid red"; // Add a red border to visualize the hitbox

    // Position the hitbox around the bomb
    bombHitboxElement.style.top = `${parseInt(bombElement.style.top) - 10}px`;
    bombHitboxElement.style.left = `${parseInt(bombElement.style.left) - 16}px`;

    // Add the bomb element and hitbox element to the game container
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.appendChild(bombElement);
      gameContainer.appendChild(bombHitboxElement);
    }

    this.bombActive = true; // Set the bomb active flag
    this.bombElement = bombElement;
    this.bombHitboxElement = bombHitboxElement;

    // Add a timeout to create the explosion after 3 seconds
    setTimeout(() => {
      this.createExplosion(bombElement);
      gameContainer.removeChild(bombElement);
      gameContainer.removeChild(bombHitboxElement);
      this.bombActive = false; // Reset the bomb active flag
    }, 3000); // Create the explosion after 3 seconds
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
