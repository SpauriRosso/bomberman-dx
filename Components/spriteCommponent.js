class SpriteComponent {
  constructor(animation, player) {
    this.player = player;
    this.frame = 0;
    this.frameSequence = [0, 1, 2]; // Frames utilisées
    this.frameWidth = 64;
    this.frameHeight = 64;
    this.speed = 5;
    this.direction = 0; // Direction par défaut (bas)
    this.isMoving = false;
    this.frameIndex = 0;
    this.animation = animation;
    this.lastUpdateTime = 0; // Pour gérer la vitesse de l'animation
  }
}

export default SpriteComponent;
