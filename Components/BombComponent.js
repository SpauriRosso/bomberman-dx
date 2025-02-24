export default class BombComponent {
  constructor(playerId, position, power = 1) {
    this.playerId = playerId;
    this.position = position;
    this.power = power;
    this.timer = 3000; // 3 seconds
    this.explosionLength = 1000; // 1 second
    this.element = null;
    this.hitboxElement = null;
    this.explosionElements = [];
    this.explosionHitboxes = [];
    this.tileSize = 64; // Tile size in pixels

    this.bombImages = [
      "url('./pictures/bomb_sprite/bomb1.png')",
      "url('./pictures/bomb_sprite/bomb2.png')",
      "url('./pictures/bomb_sprite/bomb3.png')",
    ];
  }
  playSound() {
    const audioElement = new Audio(
      "/pictures/bomb_sprite/Bomb_sound/heavy_splash.ogg"
    );
    audioElement.play();
  }
  playExplosionSound() {
    const audioElement = new Audio(
      "/pictures/bomb_sprite/Bomb_sound/8bit_bomb_explosion.wav"
    );
    audioElement.play();
  }

  // Helper method to calculate tile-centered position
  getTileCenterPosition(x, y) {
    const tileX = Math.round(x / this.tileSize);
    const tileY = Math.round(y / this.tileSize);
    return {
      x: tileX * this.tileSize + this.tileSize / 2,
      y: tileY * this.tileSize + this.tileSize / 2,
    };
  }

  createVisuals() {
    this.playSound();
    this.element = document.createElement("div");
    this.element.classList.add("bomb");

    // Center bomb on the tile using tile center position
    const centerPos = this.getTileCenterPosition(
      this.position.x,
      this.position.y
    );
    const bombSize = 64; // Fixed size

    const gameGridLeft = document.getElementById("gameGrid").offsetLeft;
    const gameGridTop = document.getElementById("gameGrid").offsetTop;

    this.element.style.left = `${centerPos.x - bombSize / 2}px`;
    this.element.style.top = `${centerPos.y - bombSize / 2}px`;
    this.element.style.width = `${bombSize}px`;
    this.element.style.height = `${bombSize}px`;
    this.element.style.backgroundImage = this.bombImages[0];

    // Create bomb hitbox (aligned with tile grid)
    this.hitboxElement = document.createElement("div");
    this.hitboxElement.classList.add("bomb-hitbox");
    this.hitboxElement.style.left = `${centerPos.x - bombSize / 2}px`;
    this.hitboxElement.style.top = `${centerPos.y - bombSize / 2}px`;
    this.hitboxElement.style.width = `${bombSize}px`;
    this.hitboxElement.style.height = `${bombSize}px`;

    // Debug hitbox visuals for the bomb element
    // this.hitboxElement.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Red, semi-transparent
    // this.hitboxElement.style.position = "absolute"; // Important for positioning
    // this.hitboxElement.style.zIndex = "10"; // Ensure it's above the bomb image (adjust as needed)

    // Store bomb visuals
    this.visuals = {
      bomb: this.element,
      hitbox: this.hitboxElement,
    };

    // Start bomb animation
    let currentFrame = 0;
    const animateInterval = setInterval(() => {
      currentFrame = (currentFrame + 1) % this.bombImages.length;
      this.element.style.backgroundImage = this.bombImages[currentFrame];
    }, 500);

    // Clear animation when bomb explodes
    setTimeout(() => clearInterval(animateInterval), this.timer);

    return this.visuals;
  }

  cleanupBombVisuals() {
    if (this.visuals && this.visuals.bomb && this.visuals.hitbox) {
      this.visuals.bomb.remove();
      this.visuals.hitbox.remove();
    }
  }

  // create the Cross Visual pattern
  createExplosion() {
    this.playExplosionSound();
    const explosionParts = [];
    const directions = [
      { x: 0, y: 0 }, // Center
      { x: 1, y: 0 }, // Right
      { x: -1, y: 0 }, // Left
      { x: 0, y: 1 }, // Down
      { x: 0, y: -1 }, // Up
    ];

    const centerPos = this.getTileCenterPosition(
      this.position.x,
      this.position.y
    );

    // Ensure explosion also aligns with tile grid
    const snappedX = Math.floor(centerPos.x / this.tileSize) * this.tileSize;
    const snappedY = Math.floor(centerPos.y / this.tileSize) * this.tileSize;

    // Create explosion for each direction
    directions.forEach((dir) => {
      for (let i = 0; i <= this.power; i++) {
        // Calculate explosion position based on exact tile steps
        const xPos = snappedX + dir.x * this.tileSize * i;
        const yPos = snappedY + dir.y * this.tileSize * i;

        // Ensure explosions stay on valid tile coordinates
        const snappedExplosionX =
          Math.floor(xPos / this.tileSize) * this.tileSize;
        const snappedExplosionY =
          Math.floor(yPos / this.tileSize) * this.tileSize;

        // Create explosion element
        const explosionElement = document.createElement("div");
        explosionElement.classList.add("explosion");
        explosionElement.style.left = `${snappedExplosionX}px`;
        explosionElement.style.top = `${snappedExplosionY}px`;
        explosionElement.style.width = `${this.tileSize}px`;
        explosionElement.style.height = `${this.tileSize}px`;

        // Create explosion hitbox
        const hitboxElement = document.createElement("div");
        hitboxElement.classList.add("explosion-hitbox");
        hitboxElement.style.left = `${snappedExplosionX}px`;
        hitboxElement.style.top = `${snappedExplosionY}px`;
        hitboxElement.style.width = `${this.tileSize}px`;
        hitboxElement.style.height = `${this.tileSize}px`;

        // Debug hitbox visuals for the explosion
        // hitboxElement.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Red, semi-transparent
        // hitboxElement.style.position = "absolute"; // Important for positioning
        // hitboxElement.style.zIndex = "10"; // Ensure it's above the bomb image (adjust as needed)

        // Store elements for cleanup
        this.explosionElements.push(explosionElement);
        this.explosionHitboxes.push(hitboxElement);

        explosionParts.push({
          element: explosionElement,
          hitbox: hitboxElement,
        });
      }
    });

    return explosionParts;
  }

  cleanup() {
    // Remove all DOM elements
    if (this.element) this.element.remove();
    if (this.hitboxElement) this.hitboxElement.remove();
    this.explosionElements.forEach((el) => el.remove());
    this.explosionHitboxes.forEach((hb) => hb.remove());
  }
  handleExplosionEffects(bombComponent) {
    if (!bombComponent) {
      console.warn("Invalid bomb component provided to handleExplosionEffects");
      return;
    }

    const tileSize = 64; // Tile size in pixels
    const { position, power } = bombComponent;
    const centerPos = getTileCenterPosition(position.x, position.y);
    console.log(centerPos);

    // Convert bomb position to tile coordinates
    const centerX = Math.floor(centerPos.x / tileSize);
    const centerY = Math.floor(centerPos.y / tileSize);

    // Check tiles in cross pattern based on explosion power
    for (let dir of [
      { x: 0, y: 0 }, // Center
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

          // Check for entities in the explosion area
          this.entities.forEach((entity) => {
            const entityPosition = entity.getComponent("Position");
            if (entityPosition) {
              const entityTileX = Math.floor(entityPosition.x / tileSize);
              const entityTileY = Math.floor(entityPosition.y / tileSize);

              if (
                entityTileX === tileX &&
                entityTileY === tileY &&
                entity.hasComponent("Health")
              ) {
                // Apply damage to the entity
                const healthComponent = entity.getComponent("Health");
                healthComponent.takeDamage(1);
              }
            }
          });
        }
      }
    }
  }
}
