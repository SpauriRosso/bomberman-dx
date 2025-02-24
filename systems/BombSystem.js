import BombComponent from "../Components/BombComponent.js";
import gameStateEntity from "../Components/PauseComponent.js";
import { tileMapDefault } from "../utils/tileMap.js";

const TILE_SIZE = 64;

function getTileCenterPosition(x, y) {
  const tileX = Math.round(x / TILE_SIZE);
  const tileY = Math.round(y / TILE_SIZE);
  return {
    x: tileX * TILE_SIZE + TILE_SIZE / 2,
    y: tileY * TILE_SIZE + TILE_SIZE / 2,
  };
}

class BombSystem {
  constructor(entities, gameStateEntity) {
    this.gameStateEntity = gameStateEntity;
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
      console.warn(`Player ${playerId} already has an active bomb.`);
      return null;
    }

    if (!this.isValidPosition(position)) {
      return null;
    }

    const bombComponent = new BombComponent(playerId, position, power);
    const visuals = bombComponent.createVisuals();

    if (!this.isValidVisuals(visuals)) {
      return null;
    }

    this.addVisualsToContainer(visuals);

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

  isValidPosition(position) {
    if (!position || typeof position !== "object") {
      console.error("Invalid position provided to createBomb");
      return false;
    }
    return true;
  }

  isValidVisuals(visuals) {
    if (!visuals || !visuals.bomb || !visuals.hitbox) {
      console.error("Failed to create bomb visuals");
      return false;
    }
    return true;
  }

  addVisualsToContainer(visuals) {
    if (this.gameContainer) {
      this.gameContainer.appendChild(visuals.bomb);
      this.gameContainer.appendChild(visuals.hitbox);
    }
  }

  handleExplosion(bombId) {
    const bombData = this.activeBombs.get(bombId);
    if (!bombData) {
      console.warn(`No bomb found with id: ${bombId}`);
      return;
    }

    const { component } = bombData;
    const explosionElements = component.createExplosion();

    if (!this.isValidExplosionElements(explosionElements)) {
      this.cleanupBomb(bombId, component);
      return;
    }

    component.cleanupBombVisuals();
    this.addExplosionToContainer(explosionElements);
    this.handleExplosionEffects(component);
    this.scheduleCleanup(bombId, component);
  }

  isValidExplosionElements(explosionElements) {
    return explosionElements && Array.isArray(explosionElements);
  }

  addExplosionToContainer(explosionElements) {
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
  }

  handleExplosionEffects(bombComponent) {
    if (!bombComponent) {
      console.warn("Invalid bomb component provided to handleExplosionEffects");
      return;
    }

    this.entities.forEach((entity) => {
      this.applyDamageIfHit(entity, bombComponent);
    });

    this.destroyBreakableTiles(bombComponent);
  }

  applyDamageIfHit(entity, bombComponent) {
    const healthComponent = entity.getComponent("HealthComponent");
    const positionComponent = entity.getComponent("PositionComponent");

    if (healthComponent && positionComponent) {
      const dx = Math.abs(bombComponent.position.x - positionComponent.x);
      const dy = Math.abs(bombComponent.position.y - positionComponent.y);
      const explosionRadius = bombComponent.power * TILE_SIZE;

      if (dx <= explosionRadius && dy <= explosionRadius) {
        healthComponent.takeDamage(50);
      }
    }
  }

  destroyBreakableTiles(bombComponent) {
    const { position, power } = bombComponent;
    const centerPos = getTileCenterPosition(position.x, position.y);
    const centerX = Math.floor(centerPos.x / TILE_SIZE);
    const centerY = Math.floor(centerPos.y / TILE_SIZE);

    for (let dir of [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ]) {
      for (let i = 0; i <= power; i++) {
        const tileX = centerX + dir.x * i;
        const tileY = centerY + dir.y * i;

        if (this.isWithinBounds(tileX, tileY)) {
          this.breakTile(tileX, tileY);
        }
      }
    }
  }

  isWithinBounds(tileX, tileY) {
    return (
      tileY >= 0 &&
      tileY < tileMapDefault.length &&
      tileX >= 0 &&
      tileX < tileMapDefault[0].length
    );
  }

  breakTile(tileX, tileY) {
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
    if (!component || typeof component.explosionLength !== "number") {
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
      if (component && typeof component.cleanup === "function") {
        component.cleanup();
      }

      this.playerBombTracking.forEach((trackedBombId, playerId) => {
        if (trackedBombId === bombId) {
          this.playerBombTracking.delete(playerId);
        }
      });

      this.activeBombs.delete(bombId);
      this.removeBombElementsFromContainer();
    } catch (error) {
      console.error("Error during bomb cleanup:", error);
    }
  }

  removeBombElementsFromContainer() {
    if (this.gameContainer) {
      const bombElements = this.gameContainer.querySelectorAll(
        ".bomb, .bomb-hitbox, .explosion, .explosion-hitbox"
      );
      bombElements.forEach((el) => el.remove());
    }
  }

  update() {
    if (this.gameStateEntity.getComponent("Pause").isPaused) return;
    if (this.activeBombs.size === 0) return;

    this.activeBombs.forEach((bombData) => {
      const { component } = bombData;
      if (component && typeof component.update === "function") {
        component.update();
      }
    });
  }
}

export default BombSystem;
