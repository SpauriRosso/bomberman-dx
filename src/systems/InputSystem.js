class InputSystem {
  constructor() {
    this.keys = new Set();
    this.listeners = [];

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    this.keys.add(e.key);
    this.notifyListeners("keydown", e.key);
  }

  handleKeyUp(e) {
    this.keys.delete(e.key);
    this.notifyListeners("keyup", e.key);
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners(eventType, key) {
    this.listeners.forEach((listener) => listener(eventType, key));
  }

  isKeyPressed(key) {
    return this.keys.has(key);
  }

  update(entities) {
    // Update input state for all entities
    entities.forEach((entity) => {
      const inputComponent = entity.getComponent("InputComponent");
      if (inputComponent) {
        inputComponent.update(this);
      }
    });
  }
}

export default InputSystem;
