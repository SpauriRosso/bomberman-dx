export default class RenderSystem {
  constructor() {
    this.container = document.getElementById("gameGrid");
  }

  update(entities) {
    // Afficher les entités sur l'écran
    entities.forEach((entity) => {
      let entityDOM = document.getElementById(entity.id);
      if (!entityDOM) {
        entityDOM = document.createElement("div");

        entityDOM.id = entity.id;
        if (entity.getComponent("sprite")) {
          entityDOM.style.background = "url('/src/frontend/assets/pictures/spritesheet.png')"; // Set player sprite
        } else if (entity.getComponent("enemySprite")) {
          console.log(entity.getComponent("enemySprite"));
          entityDOM.style.background =
            entity.getComponent("enemySprite").sprite; // Set enemy sprite
        } else {
          entityDOM.style.background = "black"; // Default for other entities
        }
      }

      let position = entity.getComponent("position");
      if (position) {
        let offset = { x: 0, y: 0 };
        entityDOM.style.position = "absolute";
        entityDOM.style.top = `${position.y + offset.y}px`;
        entityDOM.style.left = `${position.x + offset.x}px`;
        entityDOM.style.width = "64px";
        entityDOM.style.height = "64px";

        // Debug hitbox visuals for the the sprite
        // entityDOM.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Red, semi-transparent
        // entityDOM.style.position = "absolute"; // Important for positioning
        // entityDOM.style.zIndex = "10"; // Ensure it's above the bomb image (adjust as needed)
      }

      this.container.appendChild(entityDOM);
    });
  }

  clearDOM() {
    this.container.innerHTML = "";
  }
}
