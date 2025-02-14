// export default class HealthComponent {
//   constructor(health) {
//     this.health = health;
//   }
// }

class HealthComponent {
  constructor(health) {
    this.health = health;
  }

  damage(amount) {
    this.health -= amount;
    return this.health;
  }

  addLives() {
    return this.health + 1;
  }
}

export default HealthComponent;
