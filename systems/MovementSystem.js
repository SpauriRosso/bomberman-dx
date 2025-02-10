export default class MovementSystem {
  update(entities, deltaTime) {
    entities.forEach((entity) => {
      const position = entity.getComponent("position");
      const velocity = entity.getComponent("velocity");
      const input = entity.getComponent("inputs");

      if (position && velocity && input) {
        input.update();
        if (input.keys.has("q")) {
          velocity.vx = -1;
        } else if (input.keys.has("d")) {
          velocity.vx = 1;
        } else {
          velocity.vx = 0;
        }

        if (input.keys.has("z")) {
          velocity.vy = -1;
        } else if (input.keys.has("s")) {
          velocity.vy = 1;
        } else {
          velocity.vy = 0;
        }

        position.x += velocity.vx * deltaTime / 1000;
        position.y += velocity.vy * deltaTime / 1000;
      }
    });
  }
}