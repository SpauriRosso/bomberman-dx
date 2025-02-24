export default class HealthComponent {
  constructor(max = 100) {
    this.current = max;
    this.max = max;
    this.onDamage = null; // Callback for when damage is taken
  }

  takeDamage(amount) {
    const newHealth = Math.max(0, this.current - amount);
    this.current = newHealth;
    if (this.onDamage) {
      this.onDamage(newHealth);
    }
  }

  heal(amount) {
    this.current = Math.min(this.max, this.current + amount);
  }
}
