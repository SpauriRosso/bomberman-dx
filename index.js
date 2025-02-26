import { tileMapDefault, tileTypes } from "./tileMap.js";
import PlayerEntity from "./src/entities/PlayerEntity.js";
import EnemyEntity from "./src/entities/EnemyEntity.js";
import BombEntity from "./src/entities/BombEntity.js";
import MovementSystem from "./src/systems/MovementSystem.js";
import CollisionSystem from "./src/systems/CollisionSystem.js";
import BombSystem from "./src/systems/BombSystem.js";
import EnemySystem from "./src/systems/EnemySystem.js";
import PlayerSystem from "./src/systems/PlayerSystem.js";
import InputsComponent from "./src/Components/inputsComponents.js";

const entities = [];

const collisionSystem = new CollisionSystem(entities);
const playerEntity = new PlayerEntity(1, 0, 0, entities, collisionSystem);
entities.push(playerEntity);

const enemyEntity = new EnemyEntity(2);
entities.push(enemyEntity);

const bombEntity = new BombEntity(3);
entities.push(bombEntity);

const movementSystem = new MovementSystem(entities);
const bombSystem = new BombSystem(entities, collisionSystem);
const enemySystem = new EnemySystem(entities);
const playerSystem = new PlayerSystem(entities);

const inputs = new InputsComponent();

function update() {
  // Update the player's position using the inputsComponent class
  inputs.updatePlayerPosition(playerEntity);

  movementSystem.update();
  collisionSystem.update();
  collisionSystem.handleBombCollisions(entities);
  bombSystem.update();
  enemySystem.update();
  playerSystem.update();

  requestAnimationFrame(update);
}

update();
