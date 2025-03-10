import AudioSystem from "./AudioSystem.js";
import { tileMap2 } from "../utils/tileMaps.js";
import EnemyEntity from "../entities/EnemyEntity.js";
export default class GameLogicSystem {
  constructor() {
    this.entities = [];
    this.systems = [];
    this.audioContext = new AudioContext();
    this.audioSystem = new AudioSystem(this.audioContext);
    this.addSystem(this.audioSystem);
  }
  startGame() {
    this.audioSystem.playMusic("/src/frontend/assets/OST/Dynamite Night.mp3");
    this.update();
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  findEntityById(id) {
    return this.entities.find((entity) => entity.id === id);
  }

  addSystem(system) {
    this.systems.push(system);
  }

  update() {
    this.systems.forEach((system) => {
      system.update(this.entities);
    });
  }

  checkAiDefeated() {
    const remainingAI = this.entities.filter((entity) =>
      entity.getComponent("ai")
    );
    if (remainingAI.length === 0) {
      this.audioSystem.playMusic(
        "/src/frontend/assets/sound-effect/Alright!.mp3"
      );
      this.transitionToNextMap();
      return true; // Indicate that AI are defeated
    }
    return false;
  }

  transitionToNextMap() {
    // Clear current entities except player
    this.entities = this.entities.filter((entity) =>
      entity.getComponent("player")
    );

    // Load next map
    const map = tileMap2;

    // Generate new entities based on the map
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        if (tile === "I") {
          const enemy = new EnemyEntity(
            this.entities.length + 1,
            x * 64,
            y * 64,
            "url('/src/frontend/assets/pictures/spritesheet_black.png')"
          );
          this.addEntity(enemy);
        }
      }
    }

    // Reset player position to start of new map
    const player = this.entities.find((entity) =>
      entity.getComponent("player")
    );
    if (player) {
      const position = player.getComponent("position");
      position.x = 64; // Starting X position
      position.y = 64; // Starting Y position
    }

    console.log("Transitioned to second map successfully");
  }
}
