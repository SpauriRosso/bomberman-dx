export default class MovementSystem {
  constructor(collisionSystem) {
    this.collisionSystem = collisionSystem;
  }

  update(entities) {
    entities.forEach((entity) => {
      const position = entity.getComponent("position");
      const velocity = entity.getComponent("velocity");
      const input = entity.getComponent("inputs");

      if (input) {
        input.update();
      }

      if (position && velocity) {
        const nextX = position.x + velocity.vx;
        const nextY = position.y + velocity.vy;

        if (this.collisionSystem.isCollide(nextX, position.y, entity)) {
          position.x = nextX;
        }
        if (this.collisionSystem.isCollide(position.x, nextY, entity)) {
          position.y = nextY;
        }
      }
    });
  }
}
