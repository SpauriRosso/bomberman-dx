class EnemyAnimationComponent {
  constructor(animation, enemy) {
    this.enemy = enemy;
    this.frame = 0;
    this.frameSequence = [0, 1, 2];
    this.frameWidth = 64;
    this.frameHeight = 64;
    this.speed = 3;
    this.direction = 0; // 0:bas, 1:gauche, 2:droite, 3:haut
    this.isMoving = false;
    this.frameIndex = 0;
    this.animation = animation;
    this.lastUpdateTime = 0;
    this.sprite = "url('./pictures/spritesheet black.png')";
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
      enemyElement.style.background = this.sprite;
      enemyElement.style.backgroundPosition = `${posX}px ${posY}px`;
    }
  }

  moveUp() {
    this.direction = 3;
    this.isMoving = true;
  }

  moveDown() {
    this.direction = 0;
    this.isMoving = true;
  }

  moveLeft() {
    this.direction = 1;
    this.isMoving = true;
  }

  moveRight() {
    this.direction = 2;
    this.isMoving = true;
  }

  stopMoving() {
    this.isMoving = false;
  }
}

export default EnemyAnimationComponent;
