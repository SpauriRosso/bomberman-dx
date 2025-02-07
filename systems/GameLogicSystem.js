class GameLogicSystem {
  constructor() {
    this.entities = [];
    this.systems = [];
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  addSystem(system) {
    this.systems.push(system);
  }
  update() {
    this.systems.forEach((system) => {
      system.update(this.entities);
    });
  }
}

export default GameLogicSystem;
