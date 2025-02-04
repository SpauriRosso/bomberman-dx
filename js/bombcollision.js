class BombCollision {
  static activeBombs = new Set();

  static placeBomb(x, y) {
    // Check if a bomb already exists at this location
    const bombKey = `${x},${y}`;
    if (this.activeBombs.has(bombKey)) return false;

    const bombTile = Game.tilemap.getTileAt(x, y);

    const bomb = document.createElement("div");
    bomb.classList.add("bomb");
    bombTile.appendChild(bomb);

    const bombImage = document.createElement("img");
    bombImage.src = "/assests/src-game/bomb.png";
    bombImage.alt = "Bomb";
    bomb.appendChild(bombImage);

    // Add the bomb location to active bombs
    this.activeBombs.add(bombKey);

    setTimeout(() => {
      this.explodeBomb(bomb, x, y, bombKey);
    }, 3000);

    return true;
  }

  static explodeBomb(bombElement, x, y, bombKey) {
    // Remove bomb from the tile and from active bombs
    bombElement.remove();
    this.activeBombs.delete(bombKey);

    // Explosion directions
    const directions = [
      { dx: 0, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    directions.forEach((dir) => {
      const newX = x + dir.dx;
      const newY = y + dir.dy;
      const tile = Game.tilemap.getTileAt(newX, newY);

      // Create explosion effect
      this.createExplosionEffect(tile);

      if (tile.classList.contains("breakable")) {
        tile.classList.remove("breakable");
      }
    });
  }

  static createExplosionEffect(tile) {
    const explosion = document.createElement("div");
    explosion.classList.add("explosion");
    tile.appendChild(explosion);

    setTimeout(() => {
      explosion.remove();
    }, 500);
  }
}
