export default class BombComponent {
  static TILE_SIZE = 64;
  static BOMB_ANIMATION_INTERVAL = 500;
  static BOMB_TIMER = 3000;
  static EXPLOSION_LENGTH = 1000;
  static DIRECTIONS = [
    { x: 0, y: 0 }, // Center
    { x: 1, y: 0 }, // Right
    { x: -1, y: 0 }, // Left
    { x: 0, y: 1 }, // Down
    { x: 0, y: -1 }, // Up
  ];

  constructor(playerId, position, power = 1) {
    if (!playerId || !position || !this.isValidPosition(position)) {
      throw new Error("Invalid constructor parameters");
    }

    this.playerId = playerId;
    this.position = position;
    this.power = power;
    this.timer = BombComponent.BOMB_TIMER;
    this.explosionLength = BombComponent.EXPLOSION_LENGTH;

    this.elements = {
      bomb: null,
      hitbox: null,
      explosions: [],
      explosionHitboxes: [],
    };

    this.animations = {
      bombInterval: null,
    };

    this.audio = {
      bomb: new Audio("/pictures/bomb_sprite/Bomb_sound/heavy_splash.ogg"),
      explosion: new Audio(
        "/pictures/bomb_sprite/Bomb_sound/8bit_bomb_explosion.wav"
      ),
    };

    this.sprites = {
      bomb: [
        "url('./pictures/bomb_sprite/bomb1.png')",
        "url('./pictures/bomb_sprite/bomb2.png')",
        "url('./pictures/bomb_sprite/bomb3.png')",
      ],
    };
  }

  isValidPosition(position) {
    return (
      position &&
      typeof position === "object" &&
      typeof position.x === "number" &&
      typeof position.y === "number"
    );
  }

  getTileCenterPosition(x, y) {
    const tileX = Math.round(x / BombComponent.TILE_SIZE);
    const tileY = Math.round(y / BombComponent.TILE_SIZE);
    return {
      x: tileX * BombComponent.TILE_SIZE + BombComponent.TILE_SIZE / 2,
      y: tileY * BombComponent.TILE_SIZE + BombComponent.TILE_SIZE / 2,
    };
  }

  async playSound(type) {
    try {
      const audio = this.audio[type];
      if (audio) {
        await audio.play();
      }
    } catch (error) {
      console.warn(`Sound playback failed: ${error.message}`);
    }
  }

  createBombElement(centerPos) {
    const element = document.createElement("div");
    element.classList.add("bomb");

    const bombSize = BombComponent.TILE_SIZE;
    element.style.cssText = `
      left: ${centerPos.x - bombSize / 2}px;
      top: ${centerPos.y - bombSize / 2}px;
      width: ${bombSize}px;
      height: ${bombSize}px;
      background-image: ${this.sprites.bomb[0]};
    `;

    return element;
  }

  createHitboxElement(centerPos, className) {
    const hitbox = document.createElement("div");
    hitbox.classList.add(className);

    const size = BombComponent.TILE_SIZE;
    hitbox.style.cssText = `
      left: ${centerPos.x - size / 2}px;
      top: ${centerPos.y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
    `;

    return hitbox;
  }

  startBombAnimation() {
    let currentFrame = 0;
    this.animations.bombInterval = setInterval(() => {
      currentFrame = (currentFrame + 1) % this.sprites.bomb.length;
      if (this.elements.bomb) {
        this.elements.bomb.style.backgroundImage =
          this.sprites.bomb[currentFrame];
      }
    }, BombComponent.BOMB_ANIMATION_INTERVAL);

    setTimeout(() => this.stopBombAnimation(), this.timer);
  }

  stopBombAnimation() {
    if (this.animations.bombInterval) {
      clearInterval(this.animations.bombInterval);
      this.animations.bombInterval = null;
    }
  }

  createVisuals() {
    try {
      void this.playSound("bomb");

      const centerPos = this.getTileCenterPosition(
        this.position.x,
        this.position.y
      );

      this.elements.bomb = this.createBombElement(centerPos);
      this.elements.hitbox = this.createHitboxElement(centerPos, "bomb-hitbox");

      this.startBombAnimation();

      return {
        bomb: this.elements.bomb,
        hitbox: this.elements.hitbox,
      };
    } catch (error) {
      console.error("Error creating bomb visuals:", error);
      this.cleanup();
      return null;
    }
  }

  createExplosion() {
    try {
      void this.playSound("explosion");

      const explosionParts = [];
      const centerPos = this.getTileCenterPosition(
        this.position.x,
        this.position.y
      );
      const snappedPos = {
        x:
          Math.floor(centerPos.x / BombComponent.TILE_SIZE) *
          BombComponent.TILE_SIZE,
        y:
          Math.floor(centerPos.y / BombComponent.TILE_SIZE) *
          BombComponent.TILE_SIZE,
      };

      BombComponent.DIRECTIONS.forEach((dir) => {
        for (let i = 0; i <= this.power; i++) {
          const explosionPos = {
            x: snappedPos.x + dir.x * BombComponent.TILE_SIZE * i,
            y: snappedPos.y + dir.y * BombComponent.TILE_SIZE * i,
          };

          const element = this.createExplosionElement(explosionPos);
          const hitbox = this.createHitboxElement(
            explosionPos,
            "explosion-hitbox"
          );

          this.elements.explosions.push(element);
          this.elements.explosionHitboxes.push(hitbox);
          explosionParts.push({ element, hitbox });
        }
      });

      return explosionParts;
    } catch (error) {
      console.error("Error creating explosion:", error);
      return [];
    }
  }

  createExplosionElement(position) {
    const element = document.createElement("div");
    element.classList.add("explosion");
    element.style.cssText = `
      left: ${position.x}px;
      top: ${position.y}px;
      width: ${BombComponent.TILE_SIZE}px;
      height: ${BombComponent.TILE_SIZE}px;
    `;
    return element;
  }

  cleanupBombVisuals() {
    this.stopBombAnimation();
    if (this.elements.bomb) this.elements.bomb.remove();
    if (this.elements.hitbox) this.elements.hitbox.remove();
  }

  cleanup() {
    this.stopBombAnimation();

    // Cleanup all elements
    Object.values(this.elements)
      .flat()
      .forEach((element) => {
        if (element && element.remove) {
          element.remove();
        }
      });

    // Reset elements object
    this.elements = {
      bomb: null,
      hitbox: null,
      explosions: [],
      explosionHitboxes: [],
    };
  }

  handleExplosionEffects(entities, tileMapDefault) {
    if (!entities || !tileMapDefault) {
      console.warn("Missing required parameters for explosion effects");
      return;
    }

    const centerPos = this.getTileCenterPosition(
      this.position.x,
      this.position.y
    );
    const centerX = Math.floor(centerPos.x / BombComponent.TILE_SIZE);
    const centerY = Math.floor(centerPos.y / BombComponent.TILE_SIZE);

    BombComponent.DIRECTIONS.forEach((dir) => {
      for (let i = 0; i <= this.power; i++) {
        const tileX = centerX + dir.x * i;
        const tileY = centerY + dir.y * i;

        if (this.isValidMapPosition(tileX, tileY, tileMapDefault)) {
          this.processTileExplosion(tileX, tileY, tileMapDefault);
          this.processEntityDamage(tileX, tileY, entities);
        }
      }
    });
  }

  isValidMapPosition(x, y, tileMap) {
    return y >= 0 && y < tileMap.length && x >= 0 && x < tileMap[0].length;
  }

  processTileExplosion(tileX, tileY, tileMap) {
    if (tileMap[tileY][tileX] === 2) {
      tileMap[tileY][tileX] = 0;
      const tileElement = document.querySelector(
        `#gameGrid > div:nth-child(${tileY * tileMap[0].length + tileX + 1})`
      );
      if (tileElement) {
        tileElement.classList.remove("breakable");
        tileElement.classList.add("floor");
      }
    }
  }

  processEntityDamage(tileX, tileY, entities) {
    entities.forEach((entity) => {
      const position = entity.getComponent("Position");
      if (!position) return;

      const entityTileX = Math.floor(position.x / BombComponent.TILE_SIZE);
      const entityTileY = Math.floor(position.y / BombComponent.TILE_SIZE);

      if (
        entityTileX === tileX &&
        entityTileY === tileY &&
        entity.hasComponent("Health")
      ) {
        entity.getComponent("Health").takeDamage(1);
      }
    });
  }
  detectCollisions(gameEntities, tileMap) {
    const hitEntities = new Set();
    const hitTiles = new Set();
    const explosionBounds = this.getExplosionBounds();

    // Check each explosion zone
    explosionBounds.forEach((zone) => {
      // Entity collision detection
      const entityHits = this.detectEntityCollisions(zone, gameEntities);
      entityHits.forEach((entity) => hitEntities.add(entity));

      // Tile collision detection
      const tileHits = this.detectTileCollisions(zone, tileMap);
      tileHits.forEach((tile) => hitTiles.add(tile));
    });

    return {
      entities: Array.from(hitEntities),
      tiles: Array.from(hitTiles),
    };
  }

  getExplosionBounds() {
    const bounds = [];
    const centerPos = this.getTileCenterPosition(
      this.position.x,
      this.position.y
    );
    const centerTileX = Math.floor(centerPos.x / BombComponent.TILE_SIZE);
    const centerTileY = Math.floor(centerPos.y / BombComponent.TILE_SIZE);

    // Add center tile
    bounds.push({
      x: centerTileX,
      y: centerTileY,
      type: "center",
    });

    // Check in all directions
    const directions = [
      { dx: 1, dy: 0, type: "right" }, // Right
      { dx: -1, dy: 0, type: "left" }, // Left
      { dx: 0, dy: -1, type: "up" }, // Up
      { dx: 0, dy: 1, type: "down" }, // Down
    ];

    directions.forEach((dir) => {
      for (let i = 1; i <= this.power; i++) {
        const tileX = centerTileX + dir.dx * i;
        const tileY = centerTileY + dir.dy * i;

        bounds.push({
          x: tileX,
          y: tileY,
          type: dir.type,
        });
      }
    });

    return bounds;
  }

  detectEntityCollisions(zone, gameEntities) {
    const hitEntities = new Set();
    const zoneRect = {
      x: zone.x * BombComponent.TILE_SIZE,
      y: zone.y * BombComponent.TILE_SIZE,
      width: BombComponent.TILE_SIZE,
      height: BombComponent.TILE_SIZE,
    };

    gameEntities.forEach((entity) => {
      if (this.checkEntityCollision(entity, zoneRect)) {
        hitEntities.add(entity);
      }
    });

    return hitEntities;
  }

  checkEntityCollision(entity, zoneRect) {
    const position = entity.getComponent("Position");
    const hitbox = entity.getComponent("Hitbox");

    if (!position || !hitbox) return false;

    // Get entity bounds
    const entityRect = {
      x: position.x,
      y: position.y,
      width: hitbox.width || BombComponent.TILE_SIZE,
      height: hitbox.height || BombComponent.TILE_SIZE,
    };

    // Check for intersection
    return this.rectanglesIntersect(zoneRect, entityRect);
  }

  rectanglesIntersect(rect1, rect2) {
    return !(
      rect1.x + rect1.width <= rect2.x ||
      rect2.x + rect2.width <= rect1.x ||
      rect1.y + rect1.height <= rect2.y ||
      rect2.y + rect2.height <= rect1.y
    );
  }

  detectTileCollisions(zone, tileMap) {
    const hitTiles = new Set();

    // Check if tile coordinates are within map bounds
    if (this.isValidMapPosition(zone.x, zone.y, tileMap)) {
      const tileType = tileMap[zone.y][zone.x];

      // Store hit tile information
      hitTiles.add({
        x: zone.x,
        y: zone.y,
        type: tileType,
        zoneType: zone.type,
      });

      // If we hit a solid wall, we should stop the explosion in this direction
      if (tileType === 1) {
        // Assuming 1 is solid wall
        return hitTiles;
      }
    }

    return hitTiles;
  }

  handleCollisions(collisionData) {
    // Handle entity collisions
    collisionData.entities.forEach((entity) => {
      // Handle different entity types
      if (entity.hasComponent("Health")) {
        const health = entity.getComponent("Health");
        health.takeDamage(this.power);
      }

      if (entity.hasComponent("PowerUp")) {
        entity.getComponent("PowerUp").destroy();
      }

      // Emit collision event
      this.emitCollisionEvent(entity);
    });

    // Handle tile collisions
    collisionData.tiles.forEach((tile) => {
      if (tile.type === 2) {
        // Breakable block
        this.destroyTile(tile);
      }
      // Handle other tile types as needed
    });
  }

  destroyTile(tile) {
    // Update tile map
    tileMapDefault[tile.y][tile.x] = 0;

    // Update visual
    const tileElement = document.querySelector(
      `#gameGrid > div:nth-child(${
        tile.y * tileMapDefault[0].length + tile.x + 1
      })`
    );

    if (tileElement) {
      tileElement.classList.remove("breakable");
      tileElement.classList.add("floor");

      // Optional: Add destruction animation
      this.playTileDestructionAnimation(tileElement);
    }

    // Chance to spawn power-up
    this.checkPowerUpSpawn(tile);
  }

  playTileDestructionAnimation(element) {
    element.classList.add("destroying");
    setTimeout(() => {
      element.classList.remove("destroying");
    }, 300);
  }

  checkPowerUpSpawn(tile) {
    // Example: 20% chance to spawn a power-up
    if (Math.random() < 0.2) {
      this.spawnPowerUp(tile);
    }
  }

  spawnPowerUp(tile) {
    // Example power-ups
    const powerUps = ["bombUp", "powerUp", "speedUp"];
    const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];

    // Emit event for power-up spawn
    const event = new CustomEvent("powerUpSpawn", {
      detail: {
        type: randomPowerUp,
        x: tile.x * BombComponent.TILE_SIZE,
        y: tile.y * BombComponent.TILE_SIZE,
      },
    });
    document.dispatchEvent(event);
  }

  emitCollisionEvent(entity) {
    const event = new CustomEvent("bombCollision", {
      detail: {
        bomb: this,
        entity: entity,
        timestamp: Date.now(),
      },
    });
    document.dispatchEvent(event);
  }
}
