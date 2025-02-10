export default class MovementSystem {
  /**
   * Met à jour la position des entités en fonction de leur vitesse et de leur input.
   * @param {Array<Entity>} entities - Les entités à mettre à jour.
   */
  update(entities) {
    try {
      entities.forEach((entity) => {
        const position = entity.getComponent("position");
        const velocity = entity.getComponent("velocity");
        const input = entity.getComponent("inputs");

        if (position && velocity && input) {
          input.update();
          position.x += velocity.vx * 64 + input.x;
          position.y += velocity.vy * 64 + input.y;
          console.log(position.x, position.y);
        } else {
          console.error("Erreur : l'entité n'a pas les composants nécessaires");
        }
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des entités : ", error);
    }
  }
}