export default class BombSystem {
  constructor(entities) {
    this.entities = entities;
    this.explosionQueue = []; // Store pending explosions
  }

  update(deltaTime) {
    // Update existing bombs
    this.entities.forEach((entity) => {
      const bombComponent = entity.getComponent("BombComponent");
      const positionComponent = entity.getComponent("PositionComponent");

      if (bombComponent && positionComponent) {
        // Update bomb timer
        bombComponent.timer -= deltaTime;

        // Check if bomb should explode
        if (bombComponent.timer <= 0 && !bombComponent.exploded) {
          this.triggerExplosion(entity, positionComponent, bombComponent);
        }

        // Update explosion effects
        if (bombComponent.exploded) {
          bombComponent.explosionDuration -= deltaTime;

          // Remove explosion effects when duration is over
          if (bombComponent.explosionDuration <= 0) {
            entity.removeComponent("BombComponent");
          }
        }
      }
    });

    // Process explosion queue
    this.processExplosionQueue();
  }

  triggerExplosion(entity, positionComponent, bombComponent) {
    bombComponent.exploded = true;
    bombComponent.explosionDuration = bombComponent.explosionLength;

    // Calculate explosion area
    const explosionArea = this.calculateExplosionArea(
      positionComponent.x,
      positionComponent.y,
      bombComponent.radius
    );

    // Add to explosion queue
    this.explosionQueue.push({
      center: { x: positionComponent.x, y: positionComponent.y },
      radius: bombComponent.radius,
      damage: bombComponent.damage,
      owner: bombComponent.owner,
    });
  }

  calculateExplosionArea(centerX, centerY, radius) {
    const affectedTiles = [];

    // Calculate affected tiles in all four directions
    for (let direction of ["up", "right", "down", "left"]) {
      let x = centerX;
      let y = centerY;

      for (let i = 0; i < radius; i++) {
        switch (direction) {
          case "up":
            y--;
            break;
          case "right":
            x++;
            break;
          case "down":
            y++;
            break;
          case "left":
            x--;
            break;
        }

        affectedTiles.push({ x, y });

        // Stop if we hit a wall (implement collision check here)
        if (this.isWall(x, y)) break;
      }
    }

    return affectedTiles;
  }

  processExplosionQueue() {
    while (this.explosionQueue.length > 0) {
      const explosion = this.explosionQueue.shift();

      // Find entities in explosion range
      this.entities.forEach((entity) => {
        const targetPosition = entity.getComponent("PositionComponent");
        const healthComponent = entity.getComponent("HealthComponent");

        if (targetPosition && healthComponent) {
          const distance = this.calculateDistance(
            explosion.center.x,
            explosion.center.y,
            targetPosition.x,
            targetPosition.y
          );

          // Apply damage if within explosion radius
          if (distance <= explosion.radius) {
            // Calculate damage falloff based on distance
            const damageMultiplier = 1 - distance / explosion.radius;
            const finalDamage = Math.floor(explosion.damage * damageMultiplier);

            healthComponent.takeDamage(finalDamage, explosion.owner);
          }
        }
      });
    }
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  isWall(x, y) {
    // Implement collision detection with walls/obstacles
    // This should check your game's collision map or tile system
    return false; // Placeholder
  }

  // Helper method to place a new bomb
  placeBomb(x, y, owner, config = {}) {
    const bomb = {
      components: {
        PositionComponent: { x, y },
        BombComponent: {
          timer: config.timer || 3000, // 3 seconds default
          radius: config.radius || 3,
          damage: config.damage || 100,
          explosionLength: config.explosionLength || 1000, // 1 second explosion duration
          owner: owner,
          exploded: false,
        },
      },
    };

    this.entities.push(bomb);
    return bomb;
  }
}
