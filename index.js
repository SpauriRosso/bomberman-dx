import { tileMapDefault, tileTypes } from "./tileMap.js";

const entities = [];

const playerEntity = new playerEntity(1);
entities.push(playerEntity);

const enemyEntity = new enemyEntity(2);
entities.push(enemyEntity);

const bombEntity = new bombEntity(3);
entities.push(bombEntity);

const movementSystem = new movementSystem(entities);
const collisionSystem = new collisionSystem(entities);
const bombSystem = new bombSystem(entities);
const enemySystem = new enemySystem(entities);
const playerSystem = new playerSystem(entities);

const playerMovementSystem = new playerMovementSystem(
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
