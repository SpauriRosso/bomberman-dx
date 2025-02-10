import {
  tileMapDefault,
  tileTypes,
  generateGrid,
  findPlayerPosition,
} from "./tileMap.js";
import GameLogicSystem from "./systems/GameLogicSystem.js";
import RenderSystem from "./systems/RenderSystem.js";
import InputSystem from "./systems/InputSystem.js";
import PlayerEntity from "./entities/PlayerEntity.js";
import EnemyEntity from "./entities/EnemyEntity.js";
import BombEntity from "./entities/BombEntity.js";

const gameLogicSystem = new GameLogicSystem();

const playerEntity = new PlayerEntity(1);
gameLogicSystem.addEntity(playerEntity);

const enemyEntity = new EnemyEntity(2);
gameLogicSystem.addEntity(enemyEntity);

const bombEntity = new BombEntity(3);
gameLogicSystem.addEntity(bombEntity);

gameLogicSystem.addSystem(new RenderSystem());
gameLogicSystem.addSystem(new InputSystem());

function update() {
  gameLogicSystem.update();
  requestAnimationFrame(update);
}

// Ajoutez ces lignes de code pour afficher l'animation
const player = document.getElementById("0");
const frameSequence = [0, 1, 2];
let frameIndex = 0;

function animate() {
  const frame = frameSequence[frameIndex];
  const posX = -frame * 64;
  const posY = 0;
  player.style.backgroundPosition = `${posX}px ${posY}px`;
  frameIndex = (frameIndex + 1) % frameSequence.length;
  requestAnimationFrame(animate);
}

animate();

update();