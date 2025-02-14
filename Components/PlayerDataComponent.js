import HealthComponent from "./HealthComponent";

class PlayerDataComponent {
  constructor() {
    this.score = 0;
    this.health = 3
    this.healthComponent = new HealthComponent(this.health);
  }

  receiveDamage(amount) {
    return this.healthComponent.damage(amount);
  }

  heal(amount) {
    return this.healthComponent.addLives(amount);
  }
}

export default PlayerDataComponent;