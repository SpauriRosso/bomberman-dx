import AudioSystem from "./AudioSystem.js";
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
      this.loadNextMap();
    }
  }
  // loadNextMap() {
  //   // Logic to transition to the next map
  //   console.log("Transitioning to the next map...");
  //   // Here you would add the actual code to load the new map
  // }

  // loadMapEntities(mapName) {
  //   // Logic to load entities for the specified map
  //   console.log(`Loading entities for map: ${mapName}`);
  //   // Return an array of entities for the new map
  //   return [
  //     { id: 1, type: "enemy", position: { x: 100, y: 100 } },
  //     { id: 2, type: "obstacle", position: { x: 200, y: 200 } },
  //   ]; // Example entities for the new map
  // }

  // resetPlayerPosition() {
  //   // Logic to reset the player's position in the new map
  //   console.log("Resetting player position...");
  //   // Set the player's position to the starting point of the new map
  //   const startingPosition = { x: 50, y: 50 }; // Example starting position
  //   const playerEntity = this.findEntityById("player"); // Assuming player has an id of 'player'
  //   if (playerEntity) {
  //     playerEntity.position = startingPosition;
  //   }
  // }
}
