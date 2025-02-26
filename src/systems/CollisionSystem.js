import { tileMapDefault } from "../utils/tileMap.js";

export default class CollisionSystem {
  constructor() {
    this.tileMap = tileMapDefault; // Stock game level
    this.hitboxPadding = 2; // Padding around hitbox to prevent clipping
  }

  /**
   * Check collision between two entities
   * @param {Entity} entity1 - First entity
   * @param {Entity} entity2 - Second entity
   * @returns {boolean} - True if entities collide, false otherwise
   */
  checkEntityCollision(entity1, entity2) {
    const pos1 = entity1.getComponent("position");
    const pos2 = entity2.getComponent("position");
    const hitbox1 = entity1.getComponent("hitbox");
    const hitbox2 = entity2.getComponent("hitbox");

    if (!pos1 || !pos2 || !hitbox1 || !hitbox2) return false;

    return (
      pos1.x < pos2.x + hitbox2.width &&
      pos1.x + hitbox1.width > pos2.x &&
      pos1.y < pos2.y + hitbox2.height &&
      pos1.y + hitbox1.height > pos2.y
    );
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

  /**
   * Handle bomb-player collisions
   * @param {Entity[]} entities - Array of game entities
   */
  handleBombCollisions(entities) {
    const players = entities.filter((e) => e.getComponent("health"));
    const bombs = entities.filter((e) => e.getComponent("bombData"));

    for (const player of players) {
      for (const bomb of bombs) {
        if (this.checkEntityCollision(player, bomb)) {
          const health = player.getComponent("health");
          health.takeDamage(1);
          // Mark bomb for removal (to be handled by game logic)
          bomb.shouldRemove = true;
        }
      }
    }
  }
}
