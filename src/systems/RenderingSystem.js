class RenderingSystem {
  update(deltaTime) {
    const entities = ECS.getEntitiesWithComponents(Position, Sprite); // Example

    for (const entity of entities) {
      const position = ECS.getComponent(entity, Position);
      const sprite = ECS.getComponent(entity, Sprite);

      const element = document.getElementById(`entity-${entity.id}`); // Get the element or create it.
      if (!element) {
        const newElement = document.createElement("div");
        newElement.id = `entity-${entity.id}`;
        newElement.classList.add("entity"); // Add a CSS class
        document.getElementById("game-container").appendChild(newElement);
      }

      element.style.left = `${position.x}px`;
      element.style.top = `${position.y}px`;
      element.style.backgroundImage = `url(${sprite.imagePath})`;
      // ... set other styles
    }
  }
}
