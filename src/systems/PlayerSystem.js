class PlayerSystem {
  constructor(entities) {
    this.entities = entities;
  }

  update() {
    this.entities.forEach((entity) => {
      const playerComponent = entity.getComponent("PlayerComponent");
      const positionComponent = entity.getComponent("PositionComponent");
      const livesComponent = entity.getComponent("LivesComponent");

      if (playerComponent && positionComponent) {
        positionComponent.x += 1;
      }

      if (healthComponent && livesComponent) {
        if (healthComponent.health <= 0) {
          livesComponent.lives -= 1;
          healthComponent.health = 100; // Reset health to 100
        }
      }
    });
  }
}
