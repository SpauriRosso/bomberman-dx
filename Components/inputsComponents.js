import { tileMapDefault, tileTypes } from "../utils/tileMap.js";
import InputSystem from "../systems/InputSystem.js";

export default class InputComponent {
  constructor(
    playerId,
    spriteComponent,
    velocityComponent,
    inputSystem,
    bombSystem
  ) {
    if (!inputSystem || !(inputSystem instanceof InputSystem)) {
      throw new Error("InputSystem instance is required");
    }
    if (!bombSystem) {
      throw new Error("BombSystem instance is required");
    }

    this.playerId = playerId;
    this.spriteComponent = spriteComponent;
    this.velocityComponent = velocityComponent;
    this.inputSystem = inputSystem;
    this.bombSystem = bombSystem;
    this.tileMap = tileMapDefault;
    this.tileTypes = tileTypes;
    this.x = 0;
    this.y = 0;
    this.directionMap = this.spriteComponent.animation;

    // Register with input system
    this.inputSystem.addListener((eventType, key) =>
      this.handleInput(eventType, key)
    );
    this.animate(spriteComponent);
  }

  handleInput(eventType, key) {
    if (!this.directionMap.hasOwnProperty(key)) return;

    const spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    if (eventType === "keydown") {
      if (!spriteComponent.isMoving) {
        spriteComponent.isMoving = true;
        spriteComponent.frameIndex = 0;
      }
      spriteComponent.direction = this.directionMap[key];
    } else if (eventType === "keyup") {
      if (
        !this.inputSystem.isKeyPressed("ArrowLeft") &&
        !this.inputSystem.isKeyPressed("ArrowRight") &&
        !this.inputSystem.isKeyPressed("ArrowUp") &&
        !this.inputSystem.isKeyPressed("ArrowDown")
      ) {
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
    const spriteComponent = this.spriteComponent;
    if (!spriteComponent) return;

    this.velocityComponent.vy = 0;
    this.velocityComponent.vx = 0;

    if (
      (this.inputSystem.isKeyPressed("ArrowLeft") ||
        this.inputSystem.isKeyPressed("q")) &&
      (this.inputSystem.isKeyPressed("ArrowRight") ||
        this.inputSystem.isKeyPressed("d"))
    ) {
      this.velocityComponent.vx = 0;
    } else if (
      (this.inputSystem.isKeyPressed("ArrowUp") ||
        this.inputSystem.isKeyPressed("z")) &&
      (this.inputSystem.isKeyPressed("ArrowDown") ||
        this.inputSystem.isKeyPressed("s"))
    ) {
      this.velocityComponent.vy = 0;
    } else {
      if (
        this.inputSystem.isKeyPressed("ArrowLeft") ||
        this.inputSystem.isKeyPressed("q")
      ) {
        this.velocityComponent.vx = -this.spriteComponent.speed;
      }
      if (
        this.inputSystem.isKeyPressed("ArrowRight") ||
        this.inputSystem.isKeyPressed("d")
      ) {
        this.velocityComponent.vx = this.spriteComponent.speed;
      }
      if (
        this.inputSystem.isKeyPressed("ArrowUp") ||
        this.inputSystem.isKeyPressed("z")
      ) {
        this.velocityComponent.vy = -this.spriteComponent.speed;
      }
      if (
        this.inputSystem.isKeyPressed("ArrowDown") ||
        this.inputSystem.isKeyPressed("s")
      ) {
        this.velocityComponent.vy = this.spriteComponent.speed;
      }
    }

    // Handle bomb placement
    if (
      this.inputSystem.isKeyPressed(" ") ||
      this.inputSystem.isKeyPressed("Spacebar")
    ) {
      const playerElement = document.getElementById(this.playerId);
      if (playerElement) {
        const x = playerElement.offsetLeft;
        const y = playerElement.offsetTop;
        this.bombSystem.createBomb(this.playerId, { x, y });
      }
    }

    if (this.velocityComponent.vx !== 0 || this.velocityComponent.vy !== 0) {
      this.spriteComponent.isMoving = true;
    } else {
      this.spriteComponent.isMoving = false;
    }
  }
}
