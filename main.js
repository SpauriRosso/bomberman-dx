/*const timer = new Timer();
timer.start();

const scoreManager = new ScoreManager();*/

import PlayerEntity from "./entities/PlayerEntity.js";
import GameLogicSystem from "./systems/GameLogicSystem.js";
import RenderSystem from "./systems/RenderSystem.js";
import {
  generateGrid,
  findPlayerPosition,
  findEnemyPosition,
} from "./utils/tileMap.js";
import MovementSystem from "./systems/MovementSystem.js";

import { tileMapDefault } from "./utils/tileMap.js";
import CollisionSystem from "./systems/CollisionSystem.js";
import EnemyEntity from "./entities/EnemyEntity.js";

const collisionSystem = new CollisionSystem(tileMapDefault); // Initialisation
const movementSystem = new MovementSystem(collisionSystem); // On passe collisionSystem

generateGrid();
// let { x, y } = findPlayerPosition();
let coordinates = findEnemyPosition();
console.log(coordinates);
let coordinatesLength = coordinates.length;

const gameLogicSystem = new GameLogicSystem();
let urlEnnemy = [
  "url('./pictures/spritesheet black.png')",
  "url('./pictures/spritesheet yellow.png')",
  "url('./pictures/spritesheet orange.png')",
];
for (let i = 0; i < coordinatesLength; i++) {
  let { x, y } = coordinates[i];
  const enemy = new EnemyEntity(11 + i, x * 64, y * 64, urlEnnemy[i]); // Initialize enemy entity with position based on tilemap[]
  gameLogicSystem.addEntity(enemy); // Initialize enemy entity with position based on tilemap
}
console.log("enemy position on the map", findEnemyPosition());

let { x, y } = findPlayerPosition();
const player = new PlayerEntity(10, x * 64, y * 64); // Initialize player entity with position based on tilemap
gameLogicSystem.addEntity(player);
// gameLogicSystem.addSystem(new MovementSystem());
gameLogicSystem.addSystem(new RenderSystem());
gameLogicSystem.addSystem(movementSystem);
console.log(gameLogicSystem);

function gameLoop() {
  gameLogicSystem.update();

  requestAnimationFrame(gameLoop);
}
console.log("player position on the map", findPlayerPosition());

requestAnimationFrame(gameLoop);
