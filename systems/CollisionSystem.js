import { tileMapDefault } from "../utils/tileMap.js";

export default class CollisionSystem {
  constructor() {
    this.tileMap = tileMapDefault // Stock game level
  }

  /**
   * Check if pos {x,y} is free of movement
   * @param {number} x - X player position (pixels)
   * @param {number} y - Y player position
   * @returns {boolean} - True if player can move, false otherwise
   */
  isCollide(x, y) {
    const tileSize = 64; // Tile size
    // Collision list points
    const checkPoints = [
      { x: x, y: y }, // High left corner
      { x: x + tileSize - 1, y: y }, // High right corner
      { x: x, y: y + tileSize - 1 }, // inferior left corner
      { x: x + tileSize - 1, y: y + tileSize - 1 } // Inferior right corner
    ];

    // Check if some of the player checkPoints touches an obstacles
    return !checkPoints.some(point => {
      // Convert pixels to game grid indexes
      const tileX = Math.floor(point.x / tileSize);
      const tileY = Math.floor(point.y / tileSize);
      // Check target tile is an obstacle
      return this.tileMap[tileY] && (this.tileMap[tileY][tileX] === 1 || this.tileMap[tileY][tileX] === 2 || this.tileMap[tileY][tileX] === 3);
    });
  }
}