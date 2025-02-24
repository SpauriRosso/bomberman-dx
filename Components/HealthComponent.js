class HealthComponent {
  constructor(maxHealth) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }

  takeDamage(amount) {
    this.currentHealth -= amount;
    if (this.currentHealth <= 0) {
      this.currentHealth = 0;
      // Entity is dead, you can add logic here to handle death
    }
  }

  isAlive() {
    return this.currentHealth > 0;
  }
}
export default HealthComponent;
