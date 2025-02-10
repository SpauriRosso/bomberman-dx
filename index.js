import {
  tileMapDefault,
  tileTypes,
  generateGrid,
  findPlayerPosition,
} from "./tileMap.js";
import GameLogicSystem from "./systems/GameLogicSystem.js";
import RenderSystem from "./systems/RenderSystem.js";
import InputSystem from "./systems/InputSystem.js";

const entities = [];

const playerEntity = new PlayerEntity(1);
entities.push(playerEntity);

const enemyEntity = new EnemyEntity(2);
entities.push(enemyEntity);

const bombEntity = new BombEntity(3);
entities.push(bombEntity);

const movementSystem = new MovementSystem(entities);
const collisionSystem = new CollisionSystem(entities);
const bombSystem = new BombSystem(entities);
const enemySystem = new EnemySystem(entities);
const playerSystem = new PlayerSystem(entities);

const playerMovementSystem = new PlayerMovementSystem(
  tileMapDefault,
  tileTypes
);

const inputs = new inputsComponents();

function update() {
  // Update the player's position using the inputsComponent class
  inputs.updatePlayerPosition(playerEntity);

  movementSystem.update();
  collisionSystem.update();
  bombSystem.update();
  enemySystem.update();
  playerSystem.update();
  playerMovementSystem.update();

  requestAnimationFrame(update);
}

update();
