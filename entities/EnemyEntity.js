import Entity from "../entities/Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import EnemyComponent from "../Components/EnemyComponent.js";

class EnemyEntity extends Entity {
  constructor(id, x, y) {
    super(id);
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new VelocityComponent(0, 0));
    this.addComponent(new HealthComponent(50));
    this.addComponent(new EnemyComponent());
  }
}

export default EnemyEntity;
