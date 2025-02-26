import LivesComponent from "../Components/LivesComponent.js";

class PlayerEntity extends Entity {
  constructor(id, x, y, entities, gameStateEntity) {
    super(id, x, y, entities, gameStateEntity);
    this.addComponent("lives", new LivesComponent(3)); // Ajoutez un composant de vie avec 3 vies
  }
}
