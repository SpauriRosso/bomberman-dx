export default class InputComponent {
  constructor(playerId, spriteComponent, velocityComponent) {
    this.playerId = playerId;
    this.spriteComponent = spriteComponent;
    this.velocityComponent = velocityComponent;

    this.keys = new Set();
    this.directionMap = this.spriteComponent.animation;

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    this.animate(spriteComponent);
  }

  handleKeyDown(e) {
    if (!this.directionMap.hasOwnProperty(e.key)) return;

    let spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    this.keys.add(e.key);

    if (!spriteComponent.isMoving) {
      spriteComponent.isMoving = true;
      spriteComponent.frameIndex = 0; // Commence à la frame 0
    }
    // Met à jour la direction de la sprite sheet
    spriteComponent.direction = this.directionMap[e.key];
  }

  handleKeyUp(e) {
    if (!this.directionMap.hasOwnProperty(e.key)) return;

    let spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    this.keys.delete(e.key);

    if (this.keys.size === 0) {
      spriteComponent.isMoving = false;
      spriteComponent.frame = 0;
      const posX = -spriteComponent.frame * spriteComponent.frameWidth;
      const posY = -spriteComponent.direction * spriteComponent.frameHeight;

      const playerElement = document.getElementById(this.playerId);
      if (playerElement) {
        playerElement.style.backgroundPosition = `${posX}px ${posY}px`;
      }
    }
  }

  animate(sC) {
    setInterval(() => {
      if (!sC.isMoving) return;
      // Alterne entre frame 0 → 1 → 2 en boucle
      sC.frame = sC.frameSequence[sC.frameIndex];
      sC.frameIndex = (sC.frameIndex + 1) % sC.frameSequence.length; // Boucle sur 0 → 1 → 2 → 0 → 1 → 2...

      const posX = -sC.frame * sC.frameWidth;
      const posY = -sC.direction * sC.frameHeight;
      const playerElement = document.getElementById(this.playerId);
      if (playerElement) {
        playerElement.style.backgroundPosition = `${posX}px ${posY}px`;
      }
    }, 150);
  }

  update() {
    let spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    this.velocityComponent.vy = 0;
    this.velocityComponent.vx = 0;

    if (
      (this.keys.has("q") || this.keys.has("ArrowLeft")) &&
      (this.keys.has("d") || this.keys.has("ArrowRight"))
    ) {
      this.velocityComponent.vx = 0;
    } else if (
      (this.keys.has("z") || this.keys.has("ArrowUp")) &&
      (this.keys.has("s") || this.keys.has("ArrowDown"))
    ) {
      this.velocityComponent.vy = 0;
    } else if (this.keys.has("q") || this.keys.has("ArrowLeft")) {
      console.log("q");
      this.velocityComponent.vx = -this.spriteComponent.speed;
    } else if (this.keys.has("d") || this.keys.has("ArrowRight")) {
      this.velocityComponent.vx = this.spriteComponent.speed;
    } else if (this.keys.has("z") || this.keys.has("ArrowUp")) {
      console.log("z");
      this.velocityComponent.vy = -this.spriteComponent.speed;
    } else if (this.keys.has("s") || this.keys.has("ArrowDown")) {
      this.velocityComponent.vy = this.spriteComponent.speed;
    }

    if (this.velocityComponent.vx !== 0 || this.velocityComponent.vy !== 0) {
      console.log("true");
      this.spriteComponent.isMoving = true;
    } else {
      console.log("false");
      this.spriteComponent.isMoving = false;
    }
  }
}
