import { gameLogicSystem } from "../main.js";

class EnemyAnimationComponent {
  constructor(animation, enemyId, url, velocityComponent) {
    this.enemyId = enemyId;
    this.frame = 0;
    this.frameSequence = [0, 1, 2]; // Frames utilisées
    this.frameWidth = 64;
    this.frameHeight = 64;
    this.speed = 3;
    this.direction = 0; // Direction par défaut (bas)
    this.isMoving = true; // Activer le mouvement
    this.frameIndex = 0;
    this.animation = animation;
    this.lastUpdateTime = 0; // Pour gérer la vitesse de l'animation
    this.sprite = url;
    this.velocityComponent = velocityComponent;

    setInterval(() => {
      this.generateRandomMovement();
    }, 1000);
  }

  generateRandomMovement() {
    const direction = Math.floor(Math.random() * 4);
    switch (direction) {
      case 0: // Q
        this.velocityComponent.vx = -1;
        this.velocityComponent.vy = 0;
        break;
      case 1: // D
        this.velocityComponent.vx = 1;
        this.velocityComponent.vy = 0;
        break;
      case 2: // S
        this.velocityComponent.vx = 0;
        this.velocityComponent.vy = -1;
        break;
      case 3: // Z
        this.velocityComponent.vx = 0;
        this.velocityComponent.vy = 1;
        break;
    }
  }

  update() {
    const now = Date.now();
    if (now - this.lastUpdateTime > 150) {
      if (this.isMoving) {
        this.frame = this.frameSequence[this.frameIndex];
        this.frameIndex = (this.frameIndex + 1) % this.frameSequence.length;
      } else {
        this.frame = 0;
      }
      this.lastUpdateTime = now;
    }

    const posX = -this.frame * this.frameWidth;
    const posY = -this.direction * this.frameHeight;
    const enemyElement = document.getElementById(this.enemy.id);
    if (enemyElement) {
      enemyElement.style.backgroundPosition = `${posX}px ${posY}px`;
      enemyElement.style.top = `${
        this.enemy.getComponent("position").y + this.velocity.vy * 64
      }px`;
      enemyElement.style.left = `${
        this.enemy.getComponent("position").x + this.velocity.vx * 64
      }px`;
    }
  }
}

export default EnemyAnimationComponent;
