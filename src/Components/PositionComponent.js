class PositionComponent {
  constructor(x, y) {
    this.tileSize = 64; // Tile size in pixels
    this.x = x;
    this.y = y;
    this.tileX = Math.round(x / this.tileSize);
    this.tileY = Math.round(y / this.tileSize);
  }

  // Update both pixel and tile positions
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.tileX = Math.round(x / this.tileSize);
    this.tileY = Math.round(y / this.tileSize);
  }

  // Get tile-centered position
  getTileCenter() {
    return {
      x: this.tileX * this.tileSize + this.tileSize / 2,
      y: this.tileY * this.tileSize + this.tileSize / 2,
    };
  }
}
export default PositionComponent;
