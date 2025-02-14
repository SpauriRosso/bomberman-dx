class PlayerSystem {
  constructor(entities) {
    this.entities = entities;
  }

  update() {
    this.entities.forEach((entity) => {
      const playerComponent = entity.getComponent("PlayerComponent");
      const positionComponent = entity.getComponent("PositionComponent");

      if (playerComponent && positionComponent) {
        positionComponent.x += 1;
      }
    });
  }
}
