import Entity from "./Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import EnemyComponent from "../Components/EnemyComponent.js";
import EnemyAnimationComponent from "../Components/EnemySpriteComponent.js";

class EnemyEntity extends Entity {
  constructor(id, x, y) {
    super(id);
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new VelocityComponent(0, 0));
    this.addComponent(new HealthComponent(50));
    this.addComponent(new EnemyComponent());

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

    this.addComponent("sprite", spriteComponent);
  }
}

export default EnemyEntity;
