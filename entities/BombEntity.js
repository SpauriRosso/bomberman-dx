import Entity from "./Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import BombDataComponent from "../Components/BombDataComponent.js";
import HitboxComponent from "../Components/HitboxComponent.js";

class BombEntity extends Entity {
  constructor(id, x, y) {
    super(id);
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new BombDataComponent());
    this.addComponent("hitbox", new HitboxComponent());
  }
}

export default BombEntity;
