import Entity from "./entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import BombDataComponent from "../Components/BombDataComponent.js";

class BombEntity extends Entity {
  constructor(id, x, y) {
    super(id);
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new BombDataComponent());
  }
}

export default BombEntity;
