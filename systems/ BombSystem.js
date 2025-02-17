class BombSystem {
  constructor(entities) {
    this.entities = entities;
  }

  update() {
    this.entities.forEach((entity) => {
      const bombComponent = entity.getComponent("BombComponent");
      const positionComponent = entity.getComponent("PositionComponent");

      if (bombComponent && positionComponent) {
        bombComponent.explosionLength -= 1;

        if (bombComponent.explosionLength <= 0) {
          entity.removeComponent("BombComponent");
        }
      }
    });
  }
}
