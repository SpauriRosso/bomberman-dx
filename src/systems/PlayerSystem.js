class PlayerSystem {
  constructor(entities) {
    this.entities = entities;
  }

  update() {
    this.entities.forEach((entity) => {
      const playerComponent = entity.getComponent("PlayerComponent");
      const positionComponent = entity.getComponent("PositionComponent");

      if (playerComponent && positionComponent) {
        // Mettez à jour la position du joueur
        positionComponent.x += 1;
      }
    });
  }
}
