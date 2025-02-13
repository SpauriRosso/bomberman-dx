import { tileMapDefault } from "../utils/tileMap.js";

export default class CollisionSystem {
  constructor() {
    this.tileMap = tileMapDefault; // Stock game level
  }

  /**
   * Check if pos {x,y} is free of movement
   * @param {number} x - X player position (pixels)
   * @param {number} y - Y player position
   * @returns {boolean} - True if player can move, false otherwise
   */
  isCollide(x, y) {
    const tileSize = 64; // Taille d'une tuile
    const hitboxSize = 60; // Taille de la hitbox réduite
    const offset = (tileSize - hitboxSize) / 2; // Décalage pour centrer la hitbox

    // Nouvelle liste de points de collision avec la hitbox réduite
    const checkPoints = [
      { x: x + offset, y: y + offset }, // Haut gauche réduit
      { x: x + offset + hitboxSize - 1, y: y + offset }, // Haut droit réduit
      { x: x + offset, y: y + offset + hitboxSize - 1 }, // Bas gauche réduit
      { x: x + offset + hitboxSize - 1, y: y + offset + hitboxSize - 1 }, // Bas droit réduit
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
