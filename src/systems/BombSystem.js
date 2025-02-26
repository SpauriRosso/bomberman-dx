import BombComponent from "../Components/BombComponent.js";
import gameStateEntity from "../Components/PauseComponent.js";
import { tileMapDefault } from "../utils/tileMap.js";
import { gameLogicSystem, player } from "../../main.js";

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
    this.isPaused = false;

    if (!this.gameContainer) {
      console.error("Game container element not found!");
    }

    document.addEventListener("pauseToggled", (e) => {
      this.isPaused = e.detail.isPaused;
      this.handlePauseState();
    });
  }

  handlePauseState() {
    this.activeBombs.forEach((bombData) => {
      const { component, timer } = bombData;
      if (this.isPaused) {
        clearTimeout(timer);
        bombData.remainingTime =
          component.timer - (Date.now() - component.startTime);
      } else {
        bombData.timer = setTimeout(
          () => this.handleExplosion(bombData.id),
          bombData.remainingTime
        );
      }
    });
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
      id: bombId,
      component: bombComponent,
      timer: setTimeout(
        () => this.handleExplosion(bombId),
        bombComponent.timer
      ),
      remainingTime: bombComponent.timer,
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
      if (entity.getComponent("ai") || entity.getComponent("sprite")) {
        this.isHit(entity, bombComponent);
      }
    });

    this.destroyBreakableTiles(bombComponent);
  }

  isHit(entity, bombComponent) {
    const entityPos = entity.getComponent("position");
    const entityHitbox = entity.getComponent("hitbox");

    if (!entityPos) {
      console.warn(`⚠️ ${entity.id} don't have a position.`);
      return;
    }

    if (!entityHitbox) {
      console.warn(`⚠️ ${entity.id} don't have hitbox.`);
      return;
    }

    bombComponent.explosionHitboxes.forEach((hitbox) => {
      const hitboxX = parseInt(hitbox.style.left);
      const hitboxY = parseInt(hitbox.style.top);
      const hitboxSize = bombComponent.tileSize;

      if (
        entityPos.x < hitboxX + hitboxSize &&
        entityPos.x + entityHitbox.width > hitboxX &&
        entityPos.y < hitboxY + hitboxSize &&
        entityPos.y + entityHitbox.height > hitboxY
      ) {
        console.log(`💥 ${entity.id} got hit!`);
        this.handleEntityHit(entity);
      }
    });
  }

  handleEntityHit(entity) {
    const livesComponent = entity.getComponent("lives");

    if (livesComponent) {
      livesComponent.loseLife();
      console.log(`${entity.id} has ${livesComponent.lives} lives left !`);

      if (livesComponent.lives <= 0) {
        console.log(`☠️ ${entity.id} is dead !`);

        if (entity.getComponent("ai")) {
          this.entities = this.entities.filter((e) => e.id !== entity);
          gameLogicSystem.entities = gameLogicSystem.entities.filter(
            (e) => e !== entity
          );
          console.log(
            "Entities after removal:",
            this.entities.map((e) => e.id)
          );

          const entityElement = document.getElementById(entity.id);
          if (entityElement) {
            entityElement.remove();
          }
          document.getElementById(entity.id)?.remove();
          player.scoreManager.addEnemyDefeatPoints();
          gameLogicSystem.checkAiDefeated();
        } else if (entity.getComponent("sprite")) {
          livesComponent.triggerGameOver();
        }
      }
    }
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

    let destroyed = 0;

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
          this.isWithinBounds(tileX, tileY) &&
          tileMapDefault[tileY][tileX] === 2
        ) {
          this.breakTile(tileX, tileY);
          destroyed++;
        }
      }
    }
    if (destroyed > 0) {
      for (let i = 0; i < destroyed; i++) {
        player.scoreManager.addBreakablePoints();
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

  update(deltaTime) {
    if (this.gameStateEntity.getComponent("Pause").isPaused) return;
    if (this.activeBombs.size === 0) return;

    if (this.isPaused) return;

    this.activeBombs.forEach((bombData) => {
      const { component } = bombData;
      if (component && typeof component.update === "function") {
        component.update();
      }
    });
  }
}

export default BombSystem;
