import Position from "../components/Position.js";
import Sprite from "../components/Sprite.js";
import Player from "../components/Player.js"; // Player-specific component

function createPlayer(x, y) {
  const player = ECS.createEntity();
  ECS.addComponent(player, new Position(x, y));
  ECS.addComponent(player, new Sprite("assets/sprites/player.png"));
  ECS.addComponent(player, new Player()); // Add Player specific component
  // ... other components
  return player;
}
