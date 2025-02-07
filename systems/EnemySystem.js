class EnemySystem {
  constructor(entities) {
    this.entities = entities;
  }

  update() {
    this.entities.forEach((entity) => {
      const enemyComponent = entity.getComponent("EnemyComponent");
      const positionComponent = entity.getComponent("PositionComponent");

      if (enemyComponent && positionComponent) {
        // Mettez à jour la position de l'ennemi
        positionComponent.x += 1;
      }
    });
  }
}
