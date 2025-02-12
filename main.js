import PlayerEntity from "./entities/PlayerEntity.js";
import BombEntity from "./entities/BombEntity.js"; // Import BombEntity
import BombSystem from "./systems/ BombSystem.js"; // Import BombSystem
import GameLogicSystem from "./systems/GameLogicSystem.js";
import RenderSystem from "./systems/RenderSystem.js";
import { generateGrid, findPlayerPosition } from "./utils/tileMap.js";
import MovementSystem from "./systems/MovementSystem.js";
import Timer from "./utils/Timer.js";
import FPS from "./utils/FPS.js";
import { tileMapDefault } from "./utils/tileMap.js";
import CollisionSystem from "./systems/CollisionSystem.js";

// Get the timer element from the HTML document
const timerElement = document.getElementById("timer");

// Initialize the game timer with a start value of 0
const timer = new Timer();
timer.start();

// Function to pad numbers with leading zeros for 2-digit numbers
function padZero(number) {
  return (number < 10 ? "0" : "") + number;
}

const fps = new FPS();

function animate(time) {
  fps.update(time);
  requestAnimationFrame(animate);
}

animate();

const collisionSystem = new CollisionSystem(tileMapDefault);
const movementSystem = new MovementSystem(collisionSystem);

generateGrid();
let { x, y } = findPlayerPosition();

const gameLogicSystem = new GameLogicSystem();
const player = new PlayerEntity(10, x * 64, y * 64);

gameLogicSystem.addEntity(player);
gameLogicSystem.addSystem(new RenderSystem());
gameLogicSystem.addSystem(movementSystem);

const bombSystem = new BombSystem(); // Initialize BombSystem
gameLogicSystem.addSystem(bombSystem); // Add BombSystem to the game

console.log(gameLogicSystem);

// Function to place a bomb (you can call this when the player presses a key)
function placeBomb() {
  const playerPos = player.getComponent("PositionComponent");

  if (playerPos) {
    const bomb = new BombEntity(`bomb_${Date.now()}`, playerPos.x, playerPos.y);
    bombSystem.addBomb(bomb);
    console.log("Bomb placed at:", playerPos.x, playerPos.y);
  }
}

// Listen for a key press to place bombs (e.g., spacebar)
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    placeBomb();
  }
});

function gameLoop() {
  gameLogicSystem.update();

  // Update timer display
  const currentTime = timer.getTime();
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
  timerElement.textContent = `TIME ${formattedTime}`;

  requestAnimationFrame(gameLoop);
}

console.log("player position on the map", findPlayerPosition());

requestAnimationFrame(gameLoop);
