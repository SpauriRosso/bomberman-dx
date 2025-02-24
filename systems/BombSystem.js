import BombComponent from "../Components/BombComponent.js";
import gameStateEntity from "../Components/PauseComponent.js";
import { tileMapDefault } from "../utils/tileMap.js";
import HealthComponent from "../Components/HealthComponent.js";
import PositionComponent from "../Components/PositionComponent.js";

function getTileCenterPosition(x, y) {
  const tileX = Math.round(x / 64);
  const tileY = Math.round(y / 64);
  return {
    x: tileX * 64 + 64 / 2,
    y: tileY * 64 + 64 / 2,
  };
}

class BombSystem {
  constructor(entities, gameStateEntity) {
    this.gameStateEntity = gameStateEntity;
    this.entities = entities;
    this.activeBombs = new Map();
    this.playerBombTracking = new Map();
    this.gameContainer = document.getElementById("game-container");
    this.chainReactionRange = 64;

    if (!this.gameContainer) {
      console.error("Game container element not found!");
    }
  }

  createBomb(playerId, position, power = 1) {
    if (this.playerBombTracking.has(playerId)) {
      return null;
    }

    const nearbyBombs = this.getNearbyBombs(position);
    const chainReaction = nearbyBombs.length > 0;

    console.log("Bomb position:", position);
    if (!position || typeof position !== "object") {
      console.error("Invalid position provided to createBomb");
      return null;
    }

    const bombComponent = new BombComponent(playerId, position, power);
    bombComponent.chainReaction = chainReaction;
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

    component.cleanupBombVisuals();

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

    this.handleExplosionEffects(component);
    this.scheduleCleanup(bombId, component);
  }

  getNearbyBombs(position) {
    const nearbyBombs = [];
    const tileSize = 64;

    this.activeBombs.forEach((bombData, bombId) => {
      const bombPos = bombData.component.position;
      const dx = Math.abs(position.x - bombPos.x);
      const dy = Math.abs(position.y - bombPos.y);

      if (dx <= tileSize && dy <= tileSize) {
        nearbyBombs.push(bombData.component);
      }
    });

    return nearbyBombs;
  }

  handleExplosionEffects(bombComponent) {
    if (!bombComponent) {
      console.warn("Invalid bomb component provided to handleExplosionEffects");
      return;
    }

    this.entities.forEach((entity) => {
      const healthComponent = entity.getComponent("HealthComponent");
      const positionComponent = entity.getComponent("PositionComponent");

      if (healthComponent && positionComponent) {
        const dx = Math.abs(bombComponent.position.x - positionComponent.x);
        const dy = Math.abs(bombComponent.position.y - positionComponent.y);
        const explosionRadius = bombComponent.power * 64;

        console.log(
          "Player Position:",
          positionComponent.x,
          positionComponent.y
        );
        console.log(
          "Bomb Position:",
          bombComponent.position.x,
          bombComponent.position.y
        );
        console.log("dx:", dx, "dy:", dy, "Radius:", explosionRadius);

        if (dx <= explosionRadius && dy <= explosionRadius) {
          console.log("Player hit!");
          healthComponent.takeDamage(50);
          console.log("Player Health:", healthComponent.health);
        }
      }
    });

    const nearbyBombs = this.getNearbyBombs(bombComponent.position);
    nearbyBombs.forEach((bomb) => {
      if (!bomb.chainReaction) {
        bomb.chainReaction = true;
        bomb.timer = 100;
      }
    });

    const tileSize = 64;
    const { position, power } = bombComponent;
    const centerPos = getTileCenterPosition(position.x, position.y);
    console.log(centerPos);

    const centerX = Math.floor(centerPos.x / tileSize);
    const centerY = Math.floor(centerPos.y / tileSize);

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

        if (
          tileY >= 0 &&
          tileY < tileMapDefault.length &&
          tileX >= 0 &&
          tileX < tileMapDefault[0].length
        ) {
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
    try {
      if (component && typeof component.cleanup === "function") {
        component.cleanup();
      }

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

      if (this.gameContainer) {
        const bombElements = this.gameContainer.querySelectorAll(
          ".bomb, .bomb-hitbox, .explosion, .explosion-hitbox"
        );
        bombElements.forEach((el) => el.remove());
      }
    } catch (error) {
      console.error("Error during bomb cleanup:", error);
    }
  }

  update() {
    if (gameStateEntity.getComponent("Pause").isPaused) return;
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
