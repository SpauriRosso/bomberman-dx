import Entity from "./Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import PlayerDataComponent from "../Components/PlayerDataComponent.js";
import inputsComponent from "../Components/inputsComponents.js";
import SpriteComponent from "../Components/spriteCommponent.js";

class PlayerEntity extends Entity {
  constructor(id, x, y) {
    super(id);
    let velocityComponent = new VelocityComponent(0, 0);
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("velocity", velocityComponent);
    this.addComponent("health", new HealthComponent(100));
    this.addComponent("data", new PlayerDataComponent());

    let spriteComponent = new SpriteComponent(
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

    this.addComponent("sprite", spriteComponent);
    this.addComponent(
      "inputs",
      new inputsComponent(id, spriteComponent, velocityComponent)
    );
  }
}

export default PlayerEntity;
