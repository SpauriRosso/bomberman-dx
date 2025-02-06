class ECS {
  constructor() {
    this.entities = [];
    this.components = {}; // Store components by entity ID and type
    this.systems = [];
  }

  createEntity() {
    /* ... */
  }
  addComponent(entity, component) {
    /* ... */
  }
  getComponent(entity, componentType) {
    /* ... */
  }
  // ... other ECS methods (removeComponent, etc.)

  addSystem(system) {
    this.systems.push(system);
  }

  update(deltaTime) {
    for (const system of this.systems) {
      system.update(deltaTime);
    }
  }
}

export default new ECS(); // Singleton instance
