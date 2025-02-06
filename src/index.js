import ECS from "./core/ECS.js";
import { createPlayer } from "./entities/Player.js";
import RenderingSystem from "./systems/RenderingSystem.js";

const gameContainer = document.getElementById("game-container"); // Get the container

ECS.addSystem(new RenderingSystem(gameContainer)); // Add the rendering system

const player = createPlayer(100, 100); // Create the player

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastFrameTime; // Calculate time since last frame
  lastFrameTime = timestamp;

  ECS.update(deltaTime); // Update all systems

  requestAnimationFrame(gameLoop); // Call the next frame
}

let lastFrameTime = 0;
requestAnimationFrame(gameLoop);
