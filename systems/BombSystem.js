import BombComponent from "../Components/BombComponent.js";
import { tileMapDefault } from "../utils/tileMap.js";

// Moved to constants for better maintainability
const TILE_SIZE = 64;
const DIRECTIONS = [
  { x: 0, y: 0 }, // Center
  { x: 1, y: 0 }, // Right
  { x: -1, y: 0 }, // Left
  { x: 0, y: 1 }, // Down
  { x: 0, y: -1 }, // Up
];

function getTileCenterPosition(x, y) {
  const tileX = Math.round(x / TILE_SIZE);
  const tileY = Math.round(y / TILE_SIZE);
  return {
    x: tileX * TILE_SIZE + TILE_SIZE / 2,
    y: tileY * TILE_SIZE + TILE_SIZE / 2,
  };
}

class BombSystem {
  constructor(entities, gameState) {
    if (!entities || !gameState) {
      throw new Error("BombSystem requires entities and gameState parameters");
    }

    this.gameState = gameState;
    this.entities = entities;
    this.activeBombs = new Map();
    this.playerBombTracking = new Map();
    this.gameContainer = document.getElementById("game-container");

    if (!this.gameContainer) {
      throw new Error("Game container element not found!");
    }
  }

  createBomb(playerId, position, power = 1) {
    if (!playerId || !position) {
      console.error("Invalid parameters provided to createBomb");
      return null;
    }

    if (this.playerBombTracking.has(playerId)) {
      return null; // Player already has an active bomb
    }

    if (!this.isValidPosition(position)) {
      console.error("Invalid position coordinates");
      return null;
    }

    try {
      const bombComponent = new BombComponent(playerId, position, power);
      const visuals = bombComponent.createVisuals();

      if (!this.validateBombVisuals(visuals)) {
        return null;
      }

      this.gameContainer.appendChild(visuals.bomb);
      this.gameContainer.appendChild(visuals.hitbox);

      const bombId = `bomb-${Date.now()}-${playerId}`;
      this.activeBombs.set(bombId, {
        component: bombComponent,
        timer: setTimeout(
          () => this.handleExplosion(bombId),
          bombComponent.timer
        ),
      });

      this.playerBombTracking.set(playerId, bombId);
      return bombId;
    } catch (error) {
      console.error("Error creating bomb:", error);
      return null;
    }
  }

  handleExplosion(bombId) {
    const bombData = this.activeBombs.get(bombId);
    if (!bombData) {
      console.warn(`No bomb found with id: ${bombId}`);
      return;
    }

    try {
      const { component } = bombData;
      const explosionElements = component.createExplosion();

      if (!this.validateExplosionElements(explosionElements)) {
        this.cleanupBomb(bombId, component);
        return;
      }

      component.cleanupBombVisuals();
      this.appendExplosionElements(explosionElements);

      // Add this new collision detection code
      const collisions = component.detectCollisions(
        this.entities,
        tileMapDefault
      );
      component.handleCollisions(collisions);

      this.scheduleCleanup(bombId, component);
    } catch (error) {
      console.error("Error handling explosion:", error);
      this.cleanupBomb(bombId, bombData.component);
    }
  }

  handleExplosionEffects(bombComponent) {
    if (!bombComponent) {
      console.warn("Invalid bomb component provided to handleExplosionEffects");
      return;
    }

    const { position, power } = bombComponent;
    const centerPos = getTileCenterPosition(position.x, position.y);
    const centerX = Math.floor(centerPos.x / TILE_SIZE);
    const centerY = Math.floor(centerPos.y / TILE_SIZE);

    DIRECTIONS.forEach((dir) => {
      for (let i = 0; i <= power; i++) {
        const tileX = centerX + dir.x * i;
        const tileY = centerY + dir.y * i;

        if (this.isValidTilePosition(tileX, tileY)) {
          this.processExplosionTile(tileX, tileY);
        }
      }
    });
  }

  update() {
    if (this.gameState.isPaused) return;
    if (this.activeBombs.size === 0) return;

    this.activeBombs.forEach((bombData, bombId) => {
      const { component } = bombData;
      if (component?.update) {
        component.update();
      }
    });
  }

  // Helper methods
  isValidPosition(position) {
    return (
      position &&
      typeof position === "object" &&
      typeof position.x === "number" &&
      typeof position.y === "number"
    );
  }

  isValidTilePosition(x, y) {
    return (
      y >= 0 &&
      y < tileMapDefault.length &&
      x >= 0 &&
      x < tileMapDefault[0].length
    );
  }

  validateBombVisuals(visuals) {
    if (!visuals?.bomb || !visuals?.hitbox) {
      console.error("Failed to create bomb visuals");
      return false;
    }
    return true;
  }

  validateExplosionElements(elements) {
    if (!elements || !Array.isArray(elements)) {
      console.error("Invalid explosion elements returned from createExplosion");
      return false;
    }
    return true;
  }

  appendExplosionElements(explosionElements) {
    explosionElements.forEach(({ element, hitbox }) => {
      if (element && hitbox) {
        this.gameContainer.appendChild(element);
        this.gameContainer.appendChild(hitbox);
      } else {
        console.warn("Invalid explosion element or hitbox");
      }
    });
  }

  processExplosionTile(tileX, tileY) {
    if (tileMapDefault[tileY][tileX] === 2) {
      tileMapDefault[tileY][tileX] = 0;

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

  scheduleCleanup(bombId, component) {
    if (!component?.explosionLength) {
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
    try {
      if (component?.cleanup) {
        component.cleanup();
      }

      // Remove player from tracking
      for (const [
        playerId,
        trackedBombId,
      ] of this.playerBombTracking.entries()) {
        if (trackedBombId === bombId) {
          this.playerBombTracking.delete(playerId);
          break;
        }
      }

      this.activeBombs.delete(bombId);
      this.cleanupExplosionElements();
    } catch (error) {
      console.error("Error during bomb cleanup:", error);
    }
  }

  cleanupExplosionElements() {
    if (this.gameContainer) {
      const bombElements = this.gameContainer.querySelectorAll(
        ".bomb, .bomb-hitbox, .explosion, .explosion-hitbox"
      );
      bombElements.forEach((el) => el.remove());
    }
  }
}

export default BombSystem;
