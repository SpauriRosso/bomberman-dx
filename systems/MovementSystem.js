export default class MovementSystem {
  update(entities) {
    entities.forEach((entity) => {
      const position = entity.getComponent("position");
      const velocity = entity.getComponent("velocity");
      const input = entity.getComponent("inputs");

      if (position && velocity && input) {
        input.update();
        position.x += velocity.vx * 64 + input.x;
        position.y += velocity.vy * 64 + input.y;
      }
    });
  }
}
