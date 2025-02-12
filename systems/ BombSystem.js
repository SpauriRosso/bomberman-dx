class BombSystem {
  constructor(cooldownTime) {
    this.bombs = [];
    this.cooldownTime = cooldownTime;
    this.lastBombSpawnTime = 0;
  }
  addBomb(bomb) {
    const currentTime = Date.now();
    if (currentTime - this.lastBombSpawnTime < this.cooldownTime) {
      console.log("Cannot spawn bomb, cooldown in progress.");
      return;
    }

    this.bombs.push(bomb);
    this.lastBombSpawnTime = currentTime;
  }

  update(deltaTime) {
    this.bombs = this.bombs.filter((bomb) => {
      const bombData = bomb.getComponent("BombDataComponent");

      if (bombData) {
        bombData.update(deltaTime);

        if (bombData.hasExploded()) {
          this.explode(bomb);
          return false; // Remove bomb after explosion
        }
      }

      return true;
    });
  }

  explode(bomb) {
    const position = bomb.getComponent("PositionComponent");

    if (position) {
      console.log(
        `Bomb exploded at (${position.x}, ${position.y}) with radius ${
          bomb.getComponent("BombDataComponent").radius
        }`
      );
    }

    // Handle explosion effects here (e.g., damage, chain reactions)
  }
}

export default BombSystem;
