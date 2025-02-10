import { tileMapDefault } from "../utils/tileMap.js";

export default class CollisionSystem {
  constructor() {
    this.tileMap = tileMapDefault;
  }

  isCollide(x, y) {
    const tileX = Math.floor(x / 64)
    const tileY = Math.floor(y / 64)

    if (
        this.tileMap[tileY] && (this.tileMap[tileY][tileX] === 1 || this.tileMap[tileY][tileX] === 2 || this.tileMap[tileY][tileX] === 3)
    ) {
      return false;
    }
    return true;
  }
}

// class CollisionSystem {
//
//   update() {
//     this.entities.forEach((entity) => {
//       const positionComponent = entity.getComponent("PositionComponent");
//       const healthComponent = entity.getComponent("HealthComponent");
//
//       if (positionComponent && healthComponent) {
//         // Vérifiez les collisions avec les autres entités
//         this.entities.forEach((otherEntity) => {
//           const otherPositionComponent = otherEntity.getComponent("PositionComponent");
//
//           if (otherPositionComponent) {
//             // Vérifiez si les entités se chevauchent
//             if (
//               positionComponent.x < otherPositionComponent.x + 64 &&
//               positionComponent.x + 64 > otherPositionComponent.x &&
//               positionComponent.y < otherPositionComponent.y + 64 &&
//               positionComponent.y + 64 > otherPositionComponent.y
//             ) {
//               // Appliquez les dégâts
//               healthComponent.health -= 10;
//             }
//           }
//         });
//       }
//     });
//   }
// }
