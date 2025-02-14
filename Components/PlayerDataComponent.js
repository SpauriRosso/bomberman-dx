import HealthComponent from "./HealthComponent.js";

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

  addScore(amount) {
    this.score += amount;
    return this.score;
  }

  removeScore(amount) {
    this.score -= amount;
    return this.score;
  }
}

export default PlayerDataComponent;