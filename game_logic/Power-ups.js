class PowerUp {
  constructor(type, duration) {
    this.type = type; // Type of power-up (e.g., 'bombRange', 'extraBomb', 'speedBoost', 'invincibility')
    this.duration = duration; // Duration of the power-up effect in seconds
  }

  applyEffect(player) {
    switch (this.type) {
      case "bombRange":
        player.bombRange += 1; // Increase bomb range
        break;
      case "extraBomb":
        player.maxBombs += 1; // Allow the player to place an additional bomb
        break;
      case "speedBoost":
        player.speed *= 1.5; // Increase player speed
        setTimeout(() => {
          player.speed /= 1.5; // Reset speed after duration
        }, this.duration * 1000);
        break;
      case "invincibility":
        player.isInvincible = true; // Make player invincible
        setTimeout(() => {
          player.isInvincible = false; // Reset invincibility after duration
        }, this.duration * 1000);
        break;
      default:
        console.error("Unknown power-up type:", this.type);
    }
  }
}

// Example power-up instances
const bombRangePowerUp = new PowerUp("bombRange", 0);
const extraBombPowerUp = new PowerUp("extraBomb", 0);
const speedBoostPowerUp = new PowerUp("speedBoost", 5); // 5 seconds duration
const invincibilityPowerUp = new PowerUp("invincibility", 5); // 5 seconds duration

export {
  PowerUp,
  bombRangePowerUp,
  extraBombPowerUp,
  speedBoostPowerUp,
  invincibilityPowerUp,
};
