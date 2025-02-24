// Dans EnemyEntity.js
import Entity from "./Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import EnemyComponent from "../Components/EnemyComponent.js";
import EnemyAnimationComponent from "../Components/EnemySpriteComponent.js";

class EnemyEntity extends Entity {
  constructor(id, x, y, url) {
    super(id);
    this.addComponent("position", new PositionComponent(x, y));
    let velocityComponent = new VelocityComponent(0, 0);
    this.addComponent("velocity", velocityComponent);
    this.addComponent("health", new HealthComponent(1));
    this.addComponent("ai", new EnemyComponent());

    let spriteComponent = new EnemyAnimationComponent(
      {
        ArrowDown: 0, // Bas
        ArrowUp: 1, // Haut
        ArrowLeft: 2, // Gauche
        ArrowRight: 5, // Droite
        s: 0,
        z: 1,
        q: 2,
        d: 5,
      },
      id,
      url,
      velocityComponent
    );

    this.addComponent("enemySprite", spriteComponent);
  }
}

export default EnemyEntity;
