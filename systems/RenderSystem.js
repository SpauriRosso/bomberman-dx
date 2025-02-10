export default class RenderSystem {
  constructor() {
    this.container = document.getElementById("gameGrid");
  }
  update(entities) {
    // Afficher les entités sur l'écran
    entities.forEach((entity) => {
      let entityDOM = document.getElementById(entity.id)
      if (!entityDOM) {
        entityDOM = document.createElement("div");

        entityDOM.id = entity.id;

      }

      let position = entity.getComponent("position");
      let offset = { x: 0, y: 0 };
      entityDOM.style.position = "absolute";
      entityDOM.style.top = `${position.y + offset.y}px`;
      entityDOM.style.left = `${position.x + offset.x}px`;
      entityDOM.style.width = "64px";
      entityDOM.style.height = "64px";

      if (entity.getComponent("data")) {
        entityDOM.style.backgroundImage = "url('./pictures/spritesheet.png')";
        entityDOM.style.backgroundPosition = "0px 0px";
        entityDOM.style.backgroundRepeat = "no-repeat";
      } else {
        entityDOM.style.background = "black"; // Default pour les autres entités
      }

      this.container.appendChild(entityDOM);
    });
    this.animationFrame = (this.animationFrame + 1) % 4;
  }
}