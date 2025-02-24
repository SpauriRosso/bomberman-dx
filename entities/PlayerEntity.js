import Entity from "./Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import PlayerDataComponent from "../Components/PlayerDataComponent.js";
import inputsComponent from "../Components/inputsComponents.js";
import SpriteComponent from "../Components/spriteCommponent.js";
import InputSystem from "../systems/InputSystem.js";
import BombSystem from "../systems/BombSystem.js";
import gameStateEntity from "../Components/PauseComponent.js";
import LivesComponent from "../Components/LivesComponent.js";

class PlayerEntity extends Entity {
  constructor(id, x, y, entities) {
    super(id);
    let velocityComponent = new VelocityComponent(0, 0);
    const inputSystem = new InputSystem();
    const bombSystem = new BombSystem(entities, gameStateEntity);

    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("velocity", velocityComponent);
    this.addComponent(new LivesComponent(1));
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
      new inputsComponent(
        id,
        spriteComponent,
        velocityComponent,
        inputSystem,
        bombSystem
      )
    );
  }
}

export default PlayerEntity;
