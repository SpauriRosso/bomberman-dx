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
    this.audioSystem.playMusic("/OST/Dynamite Night.mp3");
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

  checkCollisions() {
    this.entities.forEach((entity1) => {
      this.entities.forEach((entity2) => {
        if (entity1 !== entity2) {
          const position1 = entity1.getComponent("position");
          const position2 = entity2.getComponent("position");
          const distance = Math.sqrt(
            (position1.x - position2.x) ** 2 + (position1.y - position2.y) ** 2
          );
          if (distance < 64) {
            // Call destroyBox or destroyEnemy here if collision detected
          }
        }
      });
    });
  }
}
