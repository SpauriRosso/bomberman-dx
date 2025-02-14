export default class RenderSystem {
  constructor(inputComponent) {
    this.container = document.getElementById("gameGrid");
  }

  update(entities) {
    // this.clearDOM();
    // Afficher les entités sur l'écran
    entities.forEach((entity) => {
      let entityDOM = document.getElementById(entity.id);
      if (!entityDOM) {
        entityDOM = document.createElement("div");

        entityDOM.id = entity.id;
        if (entity.getComponent("sprite")) {
          entityDOM.style.background = "url('./pictures/spritesheet.png')"; // Set player sprite
        } else {
          entityDOM.style.background = "black"; // Default for other entities
        }
      }

      let position = entity.getComponent("position");
      let offset = { x: 0, y: 0 };
      entityDOM.style.position = "absolute";
      entityDOM.style.top = `${position.y + offset.y}px`;
      entityDOM.style.left = `${position.x + offset.x}px`;
      entityDOM.style.width = "64px";
      entityDOM.style.height = "64px";

      this.container.appendChild(entityDOM);
    });
  }

  clearDOM() {
    this.container.innerHTML = "";
  }
}
