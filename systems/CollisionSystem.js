import { tileMapDefault } from "../utils/tileMap.js";

export default class CollisionSystem {
  constructor() {
    this.tileMap = tileMapDefault; // Stock game level
    this.hitboxPadding = 2; // Padding around hitbox to prevent clipping
  }

  /**
   * Check if pos {x,y} is free of movement
   * @param {number} x - X player position (pixels)
   * @param {number} y - Y player position
   * @returns {boolean} - True if player can move, false otherwise
   */
  isCollide(x, y) {
    const tileSize = 64; // Tile size
    const hitboxSize = 45; // Reduced hitbox size
    const offset = (tileSize - hitboxSize) / 2; // Offset to center hitbox
    const padding = this.hitboxPadding; // Collision padding

    // Nouvelle liste de points de collision avec la hitbox réduite
    // More precise collision points with padding
    const checkPoints = [
      // Corners with padding
      { x: x + offset - padding, y: y + offset - padding }, // Top-left
      { x: x + offset + hitboxSize - 1 + padding, y: y + offset - padding }, // Top-right
      { x: x + offset - padding, y: y + offset + hitboxSize - 1 + padding }, // Bottom-left
      {
        x: x + offset + hitboxSize - 1 + padding,
        y: y + offset + hitboxSize - 1 + padding,
      }, // Bottom-right

      // Midpoints with padding
      { x: x + offset + hitboxSize / 2, y: y + offset - padding }, // Top-center
      {
        x: x + offset + hitboxSize / 2,
        y: y + offset + hitboxSize - 1 + padding,
      }, // Bottom-center
      { x: x + offset - padding, y: y + offset + hitboxSize / 7 }, // Left-center
      {
        x: x + offset + hitboxSize - 1 + padding,
        y: y + offset + hitboxSize / 2,
      }, // Right-center
    ];

    // Vérifier si un des points touche un obstacle
    return !checkPoints.some((point) => {
      const tileX = Math.floor(point.x / tileSize);
      const tileY = Math.floor(point.y / tileSize);
      return (
        this.tileMap[tileY] &&
        (this.tileMap[tileY][tileX] === 1 ||
          this.tileMap[tileY][tileX] === 2 ||
          this.tileMap[tileY][tileX] === 3)
      );
    });
  }
}
