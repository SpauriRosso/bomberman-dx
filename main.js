import PlayerEntity from "./entities/PlayerEntity.js";
import GameLogicSystem from "./systems/GameLogicSystem.js";
import RenderSystem from "./systems/RenderSystem.js";
import { generateGrid, findPlayerPosition } from "./utils/tileMap.js";
import MovementSystem from "./systems/MovementSystem.js";
import Timer from "./utils/Timer.js";
import FPS from "./utils/FPS.js";

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
  // Your animation code here
  requestAnimationFrame(animate);
}

animate();
// Get the current time every second

import { tileMapDefault } from "./utils/tileMap.js";
import CollisionSystem from "./systems/CollisionSystem.js";

const collisionSystem = new CollisionSystem(tileMapDefault); // Initialisation
const movementSystem = new MovementSystem(collisionSystem); // On passe collisionSystem

generateGrid();
let { x, y } = findPlayerPosition();

const gameLogicSystem = new GameLogicSystem();
const player = new PlayerEntity(10, x * 64, y * 64); // Initialize player entity with position based on tilemap

gameLogicSystem.addEntity(player);
// gameLogicSystem.addSystem(new MovementSystem());
gameLogicSystem.addSystem(new RenderSystem());
gameLogicSystem.addSystem(movementSystem);
console.log(gameLogicSystem);

function gameLoop() {
  gameLogicSystem.update();

  // Update timer display
  const currentTime = timer.getTime();
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
  timerElement.textContent = `${formattedTime}`;

  requestAnimationFrame(gameLoop);
}
console.log("player position on the map", findPlayerPosition());

requestAnimationFrame(gameLoop);
