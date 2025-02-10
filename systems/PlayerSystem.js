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
        // Update player position based on user input or game logic
        positionComponent.x += 1;
      }
    });
  }
}
