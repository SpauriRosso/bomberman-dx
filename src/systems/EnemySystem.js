class EnemySystem {
  constructor(entities) {
    this.entities = entities;
  }

  update() {
    this.entities.forEach((entity) => {
      const enemyComponent = entity.getComponent("EnemyComponent");
      const positionComponent = entity.getComponent("PositionComponent");

      if (enemyComponent && positionComponent) {
        positionComponent.x += 1;
      }
    });
  }
}
