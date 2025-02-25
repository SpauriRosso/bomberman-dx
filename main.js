import PlayerEntity from "./entities/PlayerEntity.js";
import GameLogicSystem from "./systems/GameLogicSystem.js";
import RenderSystem from "./systems/RenderSystem.js";
import createGameStateEntity from "./entities/GameStateEntity.js"; // Creates a game state entity with the Pause component
import PauseSystem from "./systems/PauseSystem.js";
import MovementSystem from "./systems/MovementSystem.js";
import CollisionSystem from "./systems/CollisionSystem.js";
import EnemyEntity from "./entities/EnemyEntity.js";
import BombSystem from "./systems/BombSystem.js";

import {
  generateGrid,
  findPlayerPosition,
  findEnemyPosition,
  tileMapDefault,
} from "./utils/tileMap.js";
import Timer from "./utils/Timer.js";
import FPS from "./utils/FPS.js";
import HUDHeader from "./utils/HUDheader.js";

// Initialize the collision and movement systems
const collisionSystem = new CollisionSystem(tileMapDefault);
const movementSystem = new MovementSystem(collisionSystem);

// Create Timer and FPS utilities
const timer = new Timer();
const fps = new FPS();

// Global variables for the player and the game logic system
export let player;
export let gameLogicSystem;

// Generate the game grid (tile-based level)
generateGrid();

// Retrieve enemy positions from the tile map
const enemyPositions = findEnemyPosition();
const numEnemies = enemyPositions.length;

// Create the game logic system instance
gameLogicSystem = new GameLogicSystem();

// Create the game state entity that includes the Pause component
const gameStateEntity = createGameStateEntity();
gameLogicSystem.addEntity(gameStateEntity);

// Instantiate and add the PauseSystem
const pauseSystem = new PauseSystem(gameStateEntity);
gameLogicSystem.addSystem(pauseSystem);

// Instantiate and add the BombSystem
const bombSystem = new BombSystem(gameLogicSystem.entities, gameStateEntity);
gameLogicSystem.addSystem(bombSystem);

// Start game logic (e.g., music, initial updates)
gameLogicSystem.startGame();

// Define enemy sprite URLs
const enemySprites = [
  "url('./pictures/spritesheet black.png')",
  "url('./pictures/spritesheet yellow.png')",
  "url('./pictures/spritesheet orange.png')",
];

// Create enemy entities based on positions from the tile map
for (let i = 0; i < numEnemies; i++) {
  const { x, y } = enemyPositions[i];
  // Create enemy entity with an ID starting at 11 (arbitrary)
  const enemy = new EnemyEntity(11 + i, x * 64, y * 64, enemySprites[i]);
  gameLogicSystem.addEntity(enemy);
}

// Retrieve the player position from the tile map and create the player entity
const playerPosition = findPlayerPosition();
player = new PlayerEntity(
  10,
  playerPosition.x * 64,
  playerPosition.y * 64,
  gameLogicSystem.entities
);

gameLogicSystem.addEntity(player);

// Add the RenderSystem and MovementSystem to the game logic system
gameLogicSystem.addSystem(new RenderSystem());
gameLogicSystem.addSystem(movementSystem);

// Debug log of the game logic system state
// console.log(gameLogicSystem);

const hudContainer = document.createElement("div");
document.body.appendChild(hudContainer);
const hudHeader = new HUDHeader(hudContainer);

let lastFrameTime = 0;
const targetFrameTime = 1000 / 60; // 60 FPS target (16.67ms per frame)

function gameLoop(timestamp) {
  const elapsedTime = timestamp - lastFrameTime;

  if (elapsedTime >= targetFrameTime) {
    lastFrameTime = timestamp - (elapsedTime % targetFrameTime); // Adjust for drift

    // Check if game is not paused
    const isPaused = gameStateEntity.getComponent("Pause").isPaused;
    if (!isPaused) {
      gameLogicSystem.update(); // Run your game updates
    }
    timer.start(); // Update timer

    // Mettre à jour le HUD avec le score, la vie restante, le timer et les FPS
    hudHeader.updateScore(player.score);
    const healthComponent = player.getComponent("health");
    if (healthComponent) {
      hudHeader.updateHealth(healthComponent.value);
    }
    hudHeader.updateTimer(timer.display());
    hudHeader.updateFPS(fps.update(performance.now()));
  }
  requestAnimationFrame(gameLoop); // Continue loop
}
requestAnimationFrame(gameLoop);
