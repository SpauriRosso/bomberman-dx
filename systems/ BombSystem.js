class BombSystem {
  constructor() {
    this.bombs = [];
  }

  addBomb(bomb) {
    this.bombs.push(bomb);
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
