export default class HealthComponent {
  constructor(max = 100) {
    this.current = max;
    this.max = max;
  }

  takeDamage(amount) {
    this.current = Math.max(0, this.current - amount);
  }

  heal(amount) {
    this.current = Math.min(this.max, this.current + amount);
  }
}
