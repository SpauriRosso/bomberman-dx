import BombComponent from "../Components/BombComponent.js";
import { tileMapDefault } from "../utils/tileMap.js";

class BombSystem {
  constructor(entities) {
    this.entities = entities;
    this.activeBombs = new Map();
    this.playerBombTracking = new Map();
    this.gameContainer = document.getElementById("game-container");

    if (!this.gameContainer) {
      console.error("Game container element not found!");
    }
  }

  createBomb(playerId, position, power = 1) {
    if (this.playerBombTracking.has(playerId)) {
      return null; // Player already has an active bomb
    }

    console.log("Bomb position:", position); // log the coordinates of Bomb
    if (!position || typeof position !== "object") {
      console.error("Invalid position provided to createBomb");
      return null;
    }

    const bombComponent = new BombComponent(playerId, position, power);
    const visuals = bombComponent.createVisuals();

    if (!visuals || !visuals.bomb || !visuals.hitbox) {
      console.error("Failed to create bomb visuals");
      return null;
    }

    if (this.gameContainer) {
      this.gameContainer.appendChild(visuals.bomb);
      this.gameContainer.appendChild(visuals.hitbox);
    }

    const bombId = `bomb-${Date.now()}`;
    this.activeBombs.set(bombId, {
      component: bombComponent,
      timer: setTimeout(
        () => this.handleExplosion(bombId),
        bombComponent.timer
      ),
    });

    this.playerBombTracking.set(playerId, bombId);
    return bombId;
  }

  handleExplosion(bombId) {
    const bombData = this.activeBombs.get(bombId);
    if (!bombData) {
      console.warn(`No bomb found with id: ${bombId}`);
      return;
    }

    const { component } = bombData;
    const explosionElements = component.createExplosion();

    if (!explosionElements || !Array.isArray(explosionElements)) {
      console.error("Invalid explosion elements returned from createExplosion");
      this.cleanupBomb(bombId, component);
      return;
    }

    if (this.gameContainer) {
      explosionElements.forEach(({ element, hitbox }) => {
        if (element && hitbox) {
          this.gameContainer.appendChild(element);
          this.gameContainer.appendChild(hitbox);
        } else {
          console.warn("Invalid explosion element or hitbox");
        }
      });
    }

    // Handle collision detection and tile destruction
    this.handleExplosionEffects(component);

    // Clean up after explosion
    this.scheduleCleanup(bombId, component);
  }

  handleExplosionEffects(bombComponent) {
    if (!bombComponent) {
      console.warn("Invalid bomb component provided to handleExplosionEffects");
      return;
    }

    const tileSize = 64; // Tile size in pixels
    const { position, power } = bombComponent;

    // Convert bomb position to tile coordinates
    const centerX = Math.floor(position.x / tileSize);
    const centerY = Math.floor(position.y / tileSize);

    // Check tiles in cross pattern based on explosion power
    for (let dir of [
      { x: 1, y: 0 }, // Right
      { x: -1, y: 0 }, // Left
      { x: 0, y: 1 }, // Down
      { x: 0, y: -1 }, // Up
    ]) {
      for (let i = 0; i <= power; i++) {
        const tileX = centerX + dir.x * i;
        const tileY = centerY + dir.y * i;

        // Check if tile is within map bounds
        if (
          tileY >= 0 &&
          tileY < tileMapDefault.length &&
          tileX >= 0 &&
          tileX < tileMapDefault[0].length
        ) {
          // Check if tile is breakable (value 2)
          if (tileMapDefault[tileY][tileX] === 2) {
            // Destroy tile by setting it to floor (value 0)
            tileMapDefault[tileY][tileX] = 0;

            // Update visual representation
            const tileElement = document.querySelector(
              `#gameGrid > div:nth-child(${
                tileY * tileMapDefault[0].length + tileX + 1
              })`
            );
            if (tileElement) {
              tileElement.classList.remove("breakable");
              tileElement.classList.add("floor");
            }
          }
        }
      }
    }
  }

  scheduleCleanup(bombId, component) {
    if (!component || typeof component.explosionLength !== "number") {
      console.warn("Invalid component or explosion length");
      this.cleanupBomb(bombId, component);
      return;
    }

    setTimeout(
      () => this.cleanupBomb(bombId, component),
      component.explosionLength
    );
  }

  cleanupBomb(bombId, component) {
    if (component && typeof component.cleanup === "function") {
      component.cleanup();
    }

    // Remove player from tracking
    for (const [playerId, trackedBombId] of this.playerBombTracking.entries()) {
      if (trackedBombId === bombId) {
        this.playerBombTracking.delete(playerId);
        break;
      }
    }

    this.activeBombs.delete(bombId);
  }

  update() {
    if (this.activeBombs.size === 0) return;

    this.activeBombs.forEach((bombData, bombId) => {
      const { component } = bombData;
      if (component && typeof component.update === "function") {
        component.update();
      }
    });
  }
}

export default BombSystem;
