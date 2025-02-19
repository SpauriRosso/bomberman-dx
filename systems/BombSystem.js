import BombComponent from "../Components/BombComponent.js";

class BombSystem {
  constructor(entities) {
    this.entities = entities;
    this.activeBombs = new Map();
    this.gameContainer = document.getElementById("game-container");

    if (!this.gameContainer) {
      console.error("Game container element not found!");
    }
  }

  createBomb(playerId, position, power = 1) {
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
    // Implement collision detection and tile destruction logic
    // This should interact with CollisionSystem and GameLogicSystem
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
