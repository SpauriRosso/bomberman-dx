import Entity from "./Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import EnemyComponent from "../Components/EnemyComponent.js";
import EnemyAnimationComponent from "../Components/EnemySpriteComponent.js";
import inputsComponent from "../Components/inputsComponents.js";

class EnemyEntity extends Entity {
  constructor(id, x, y) {
    super(id);
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("velocity", new VelocityComponent(0, 0));
    this.addComponent("health", new HealthComponent(50));
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
      id
    );

    console.log(spriteComponent);

    this.addComponent("enemySprite", spriteComponent);
    this.addComponent("inputs", new inputsComponent(id, spriteComponent));
  }
}

export default EnemyEntity;
