import Entity from "./Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import PlayerDataComponent from "../Components/PlayerDataComponent.js";
import inputsComponent from "../Components/inputsComponents.js";

class PlayerEntity extends Entity {
  constructor(id, x, y) {
    super(id);
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("velocity", new VelocityComponent(0, 0));
    this.addComponent("health", new HealthComponent(100));
    this.addComponent("data", new PlayerDataComponent());
    this.addComponent("inputs", new inputsComponent());
  }

  addComponent(name, component) {
    this.components[name] = component;
  }

  getComponent(name) {
    return this.components[name];
  }
}

export default PlayerEntity;
