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
    this.tileSize = 32; // Assuming 32px tiles, adjust as needed

    this.bombImages = [
      "url('./pictures/bomb_sprite/bomb1.png')",
      "url('./pictures/bomb_sprite/bomb2.png')",
      "url('./pictures/bomb_sprite/bomb3.png')",
    ];
  }

  createVisuals() {
    this.element = document.createElement("div");
    this.element.classList.add("bomb");

    // Use pixel positions directly without multiplying by tile size
    this.element.style.left = `${this.position.x - this.tileSize / 2}px`;
    this.element.style.top = `${this.position.y - this.tileSize / 2}px`;
    this.element.style.width = `${this.tileSize}px`;
    this.element.style.height = `${this.tileSize}px`;
    this.element.style.backgroundImage = this.bombImages[0];

    // Create bomb hitbox
    this.hitboxElement = document.createElement("div");
    this.hitboxElement.classList.add("bomb-hitbox");
    this.hitboxElement.style.left = `${this.position.x - this.tileSize / 2}px`;
    this.hitboxElement.style.top = `${this.position.y - this.tileSize / 2}px`;
    this.hitboxElement.style.width = `${this.tileSize}px`;
    this.hitboxElement.style.height = `${this.tileSize}px`;

    // Start bomb animation
    let currentFrame = 0;
    const animateInterval = setInterval(() => {
      currentFrame = (currentFrame + 1) % this.bombImages.length;
      this.element.style.backgroundImage = this.bombImages[currentFrame];
    }, 500);

    // Clear animation when bomb explodes
    setTimeout(() => clearInterval(animateInterval), this.timer);

    return { bomb: this.element, hitbox: this.hitboxElement };
  }

  createExplosion() {
    const explosionParts = [];
    const directions = [
      { x: 0, y: 0 }, // Center
      { x: 1, y: 0 }, // Right
      { x: -1, y: 0 }, // Left
      { x: 0, y: 1 }, // Down
      { x: 0, y: -1 }, // Up
    ];

    // Create explosion for each direction
    directions.forEach((dir) => {
      for (let i = 0; i < (dir.x === 0 && dir.y === 0 ? 1 : this.power); i++) {
        // Calculate position based on the original bomb's pixel position
        const xPos = this.position.x + dir.x * this.tileSize * i;
        const yPos = this.position.y + dir.y * this.tileSize * i;

        // Create explosion element
        const explosionElement = document.createElement("div");
        explosionElement.classList.add("explosion");
        explosionElement.style.left = `${xPos}px`;
        explosionElement.style.top = `${yPos}px`;
        explosionElement.style.width = `${this.tileSize}px`;
        explosionElement.style.height = `${this.tileSize}px`;

        // Create explosion hitbox
        const hitboxElement = document.createElement("div");
        hitboxElement.classList.add("explosion-hitbox");
        hitboxElement.style.left = `${xPos}px`;
        hitboxElement.style.top = `${yPos}px`;
        hitboxElement.style.width = `${this.tileSize}px`;
        hitboxElement.style.height = `${this.tileSize}px`;

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
}
