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
    const remainingAI = this.entities.filter(entity => entity.getComponent("ai"))
    if (remainingAI.length === 0) {
      this.audioSystem.playMusic("/src/frontend/assets/sound-effect/Win.mp3");
      setTimeout(() => {
        alert("You win!");
      }, 1000);
    }
  }
}
