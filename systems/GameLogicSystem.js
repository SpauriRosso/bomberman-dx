import MovementSystem from './MovementSystem.js';
import InputSystem from './InputSystem.js';

class GameLogicSystem {
  constructor() {
    this.entities = [];
    this.systems = [];
    this.deltaTime = 0;
    this.lastTime = 0;

    this.addSystem(new MovementSystem());
    this.addSystem(new InputSystem());
  }

  addSystem(system) {
    this.systems.push(system);
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  update(time) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    this.systems.forEach((system) => {
      system.update(this.entities, this.deltaTime);
    });
  }

  render() {
    // Code de rendu du jeu
    console.log("Rendu du jeu");
  }

  run() {
    requestAnimationFrame((time) => {
      this.update(time);
      this.render();
      this.run();
    });
  }
}

export default GameLogicSystem;
