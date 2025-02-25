
export default class MovementSystem {
  constructor(collisionSystem, gameStateEntity) {
    this.collisionSystem = collisionSystem;
    this.gameStateEntity = gameStateEntity;
  }

  update(entities) {
    entities.forEach((entity) => {
      const position = entity.getComponent("position");
      const velocity = entity.getComponent("velocity");
      const input = entity.getComponent("inputs");

      if (input) input.update();

      if (position && velocity) {
        const nextX = position.x + velocity.vx;
        const nextY = position.y + velocity.vy;

        if (
            this.collisionSystem.isCollide(nextX, position.y) &&
            !this.collisionSystem.isEntityCollide(entity, nextX, position.y)
        ) {
          position.x = nextX;
        }

        if (this.collisionSystem.isCollide(position.x, nextY) &&
            !this.collisionSystem.isEntityCollide(entity, position.x, nextY)) {
          position.y = nextY;
        }
      }
    });
  }
}
