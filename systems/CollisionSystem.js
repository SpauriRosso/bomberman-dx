class CollisionSystem {

  update() {
    this.entities.forEach((entity) => {
      const positionComponent = entity.getComponent("PositionComponent");
      const healthComponent = entity.getComponent("HealthComponent");

      if (positionComponent && healthComponent) {
        // Vérifiez les collisions avec les autres entités
        this.entities.forEach((otherEntity) => {
          const otherPositionComponent = otherEntity.getComponent("PositionComponent");

          if (otherPositionComponent) {
            // Vérifiez si les entités se chevauchent
            if (
              positionComponent.x < otherPositionComponent.x + 64 &&
              positionComponent.x + 64 > otherPositionComponent.x &&
              positionComponent.y < otherPositionComponent.y + 64 &&
              positionComponent.y + 64 > otherPositionComponent.y
            ) {
              // Appliquez les dégâts
              healthComponent.health -= 10;
            }
          }
        });
      }
    });
  }
}
