import PlayerEntity from "./entities/PlayerEntity.js";
import GameLogicSystem from "./systems/GameLogicSystem.js";
import RenderSystem from "./systems/RenderSystem.js";
import {
  generateGrid,
  findPlayerPosition,
  findEnemyPosition,
} from "./utils/tileMap.js";
import MovementSystem from "./systems/MovementSystem.js";

import FPS from "./utils/FPS.js";
import Timer from "./utils/Timer.js";

import { tileMapDefault } from "./utils/tileMap.js";
import CollisionSystem from "./systems/CollisionSystem.js";
import EnemyEntity from "./entities/EnemyEntity.js";
import HUDHeader from "./utils/HUDheader.js";

const collisionSystem = new CollisionSystem(tileMapDefault);
const movementSystem = new MovementSystem(collisionSystem);

const timer = new Timer();
const fps = new FPS();

export let player;
export let gameLogicSystem;

generateGrid();

let coordinates = findEnemyPosition();
let coordinatesLength = coordinates.length;

gameLogicSystem = new GameLogicSystem();
gameLogicSystem.startGame();

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

let { x, y } = findPlayerPosition();
player = new PlayerEntity(10, x * 64, y * 64, gameLogicSystem.entities); // Initialize player entity with position based on tilemap
gameLogicSystem.addEntity(player);
gameLogicSystem.addSystem(new RenderSystem());
gameLogicSystem.addSystem(movementSystem);
console.log(gameLogicSystem);

const hudContainer = document.createElement("div");
document.body.appendChild(hudContainer);
const hudHeader = new HUDHeader(hudContainer);

function gameLoop() {
  gameLogicSystem.update();

  fps.update(performance.now());
  timer.start();

  // Mettre à jour le HUD avec le score, le timer et les FPS
  hudHeader.updateScore(player.score);
  hudHeader.updateTimer(timer.display());
  hudHeader.updateFPS(fps.fps);

  requestAnimationFrame(gameLoop);
}
console.log("player position on the map", findPlayerPosition());

requestAnimationFrame(gameLoop);
