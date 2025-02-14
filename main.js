import Timer from "./utils/Timer.js"; // Import Timer
import PlayerEntity from "./entities/PlayerEntity.js";
import BombSystem from "./systems/ BombSystem.js";
import GameLogicSystem from "./systems/GameLogicSystem.js";
import RenderSystem from "./systems/RenderSystem.js";
import {
  generateGrid,
  findPlayerPosition,
  findEnemyPosition,
} from "./utils/tileMap.js";
import MovementSystem from "./systems/MovementSystem.js";
import FPS from "./utils/FPS.js";
import HUDHeader from "./utils/HUDheader.js";
import { tileMapDefault } from "./utils/tileMap.js";
import GridUpdateSystem from "./systems/GridUpdateSystem.js";
import CollisionSystem from "./systems/CollisionSystem.js";
import EnemyEntity from "./entities/EnemyEntity.js";


const collisionSystem = new CollisionSystem(tileMapDefault); // Initialisation
const movementSystem = new MovementSystem(collisionSystem);

export let player;
export let gameLogicSystem;

const header = new HUDHeader(document.body, "header-image.png");
const fps = new FPS();
const timer = new Timer();
function animate(time) {
  fps.update(time);
  requestAnimationFrame(animate);
}

animate();

const collisionSystem = new CollisionSystem(tileMapDefault);
const movementSystem = new MovementSystem(collisionSystem);


generateGrid();


let coordinates = findEnemyPosition();
let coordinatesLength = coordinates.length;

gameLogicSystem = new GameLogicSystem();

const gameLogicSystem = new GameLogicSystem();
const player = new PlayerEntity(10, x * 64, y * 64);


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
player = new PlayerEntity(10, x * 64, y * 64); // Initialize player entity with position based on tilemap
gameLogicSystem.addEntity(player);
gameLogicSystem.addSystem(new RenderSystem());
gameLogicSystem.addSystem(movementSystem);

const bombSystem = new BombSystem();
gameLogicSystem.addSystem(bombSystem);

const gridUpdateSystem = new GridUpdateSystem();
gridUpdateSystem.update(tileMapDefault);
gameLogicSystem.addSystem(gridUpdateSystem);

console.log(gameLogicSystem);

// Game Loop
function gameLoop() {
  gameLogicSystem.update();
  timer.update(); // Update Timer

  requestAnimationFrame(gameLoop);
}

console.log("player position on the map", findPlayerPosition());

requestAnimationFrame(gameLoop);
