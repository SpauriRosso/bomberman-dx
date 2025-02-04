class Collision {
  static checkCollision(x, y) {
    const tile = Game.tilemap.getTileAt(x, y);
    return (
      tile.classList.contains("wall") || tile.classList.contains("breakable")
    );
  }
}
