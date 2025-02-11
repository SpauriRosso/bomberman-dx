export default class Bomb {
  constructor(playerId, gameContainerId, tileSize) {
    this.playerId = playerId;
    this.gameContainerId = gameContainerId;
    this.tileSize = tileSize;
    this.bombPlaced = false;
  }

  createBomb() {
    const bombElement = document.createElement("div");
    bombElement.classList.add("bomb");
    bombElement.style.position = "absolute";
    bombElement.style.width = "40px";
    bombElement.style.height = "40px";
    bombElement.style.backgroundColor = "black";
    bombElement.style.borderRadius = "50%";

    return bombElement;
  }

  createExplosion() {
    const explosionElement = document.createElement("div");
    explosionElement.classList.add("explosion");
    explosionElement.style.position = "absolute";
    explosionElement.style.width = `${this.tileSize * 3}px`;
    explosionElement.style.height = `${this.tileSize * 3}px`;
    explosionElement.style.backgroundColor = "red";
    explosionElement.style.borderRadius = "0";
    explosionElement.style.opacity = "0";
    explosionElement.style.transition = "opacity 0.5s";

    return explosionElement;
  }

  placeBomb() {
    if (this.bombPlaced) return;

    const playerElement = document.getElementById(this.playerId);
    if (!playerElement) return;

    const bombElement = this.createBomb();
    const playerRect = playerElement.getBoundingClientRect();
    const bombSize = 60; // Assuming the bomb is 60x60 pixels

    bombElement.style.left = `${
      playerRect.left + playerRect.width / 2 - bombSize / 2
    }px`;
    bombElement.style.top = `${
      playerRect.top + playerRect.height / 2 - bombSize / 2
    }px`;

    const gameContainer = document.getElementById(this.gameContainerId);
    if (gameContainer) {
      gameContainer.appendChild(bombElement);
      this.bombPlaced = true;

      const explosionElement = this.createExplosion();

      const explosionLeft =
        Math.floor(playerRect.left / this.tileSize) * this.tileSize;
      const explosionTop =
        Math.floor(playerRect.top / this.tileSize) * this.tileSize;

      explosionElement.style.left = `${explosionLeft}px`;
      explosionElement.style.top = `${explosionTop}px`;

      gameContainer.appendChild(explosionElement);

      // Animate explosion
      setTimeout(() => {
        explosionElement.style.opacity = "1";
      }, 2500); // Start explosion animation after 2.5 seconds

      // Remove bomb and explosion after 3 seconds
      setTimeout(() => {
        bombElement.remove();
        explosionElement.remove();
        this.bombPlaced = false; // Reset bombPlaced flag
      }, 3000);
    }
  }
}
