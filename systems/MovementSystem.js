export default class MovementSystem {
  constructor(collisionSystem) {
    this.collisionSystem = collisionSystem;
  }

  update(entities) {
    entities.forEach((entity) => {
      const position = entity.getComponent("position");
      const velocity = entity.getComponent("velocity");
      const input = entity.getComponent("inputs");

      if (position && velocity && input) {
        input.update();

        // Nouvelle position potentielle
        const nextX = position.x + velocity.vx * 64 + input.x;
        const nextY = position.y + velocity.vy * 64 + input.y;

        // Vérifier la collision avant d'appliquer le mouvement
        if (this.collisionSystem.isCollide(nextX, position.y)) {
          position.x = nextX;
        }
        if (this.collisionSystem.isCollide(position.x, nextY)) {
          position.y = nextY;
        }
      }
    });
  }
}
