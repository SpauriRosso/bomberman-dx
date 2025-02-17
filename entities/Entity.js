export default class Entity {
  constructor(id) {
    this.id = id;
    this.components = {};
  }

  addComponent(name, component) {
    this.components[name] = component;
  }
  removeComponent(name) {
    delete this.components[name];
  }

  getComponent(name) {
    return this.components[name];
  }
}
