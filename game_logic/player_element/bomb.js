// bomb.js

class Bomb {
  constructor(tileMap, playerMovement, tileTypes) {
    this.tileMap = tileMap;
    this.playerMovement = playerMovement;
    this.tileTypes = tileTypes;
    this.bombPosition = null;
    this.isPlanted = false;
    this.explosionRadius = 1; // Adjust as needed
  }

  plantBomb() {
    if (this.isPlanted) return;

    this.bombPosition = { ...this.playerMovement.playerPosition };
    this.isPlanted = true;

    this.tileMap[this.bombPosition.y][this.bombPosition.x] = "B";
    const bombIndex =
      this.bombPosition.y * this.tileMap[0].length + this.bombPosition.x;
    const bombElement = document.getElementById("gameGrid").children[bombIndex];

    // Create the image element
    const bombImage = document.createElement("img");
    bombImage.src = "/pictures/bomb.png"; // Replace with your bomb image path
    bombImage.classList.add("bomb-image"); // Add a class for styling if needed
    bombImage.style.width = "100%"; // Or a specific size
    bombImage.style.height = "100%";
    bombImage.style.objectFit = "contain";

    // Append the image to the bomb element
    bombElement.innerHTML = ""; // Clear any existing content
    bombElement.appendChild(bombImage);
    bombElement.classList.add("bomb"); // Add bomb class after image is set

    // Detonate automatically after 3 seconds
    setTimeout(() => {
      this.detonateBomb();
    }, 3000); // 3000 milliseconds = 3 seconds
  }
  detonateBomb() {
    if (!this.isPlanted) return;

    const { x, y } = this.bombPosition;

    // Clear bomb from tileMap and grid immediately upon detonation
    this.tileMap[y][x] = 0;
    const bombIndex = y * this.tileMap[0].length + x;
    const bombElement = document.getElementById("gameGrid").children[bombIndex];
    bombElement.classList.remove("bomb");
    bombElement.classList.add("floor");

    for (let i = -this.explosionRadius; i <= this.explosionRadius; i++) {
      for (let j = -this.explosionRadius; j <= this.explosionRadius; j++) {
        const blastX = x + i;
        const blastY = y + j;

        if (this.isValidBlast(blastX, blastY)) {
          this.explodeTile(blastX, blastY);
          this.visualExplosion(blastX, blastY);
        }
      }
    }

    this.isPlanted = false;
    this.bombPosition = null;
  }

  visualExplosion(x, y) {
    const explosionIndex = y * this.tileMap[0].length + x;
    const explosionElement =
      document.getElementById("gameGrid").children[explosionIndex];

    const explosionImage = document.createElement("img");
    explosionImage.src = "/pictures/explosion.png"; // Or a series of images for animation
    explosionImage.classList.add("explosion-image");
    explosionImage.style.width = "100%";
    explosionImage.style.height = "100%";
    explosionImage.style.objectFit = "contain";

    explosionElement.innerHTML = ""; // Clear existing content (bomb or floor)
    explosionElement.appendChild(explosionImage);
    explosionElement.classList.add("explosion");

    setTimeout(() => {
      explosionElement.classList.remove("explosion");
      explosionElement.innerHTML = ""; // Clear explosion image
      explosionElement.classList.add("floor"); // Reset to floor class if needed
    }, 500); // Adjust duration as needed
  }
  isValidBlast(x, y) {
    return (
      y >= 0 && y < this.tileMap.length && x >= 0 && x < this.tileMap[0].length
    );
  }

  explodeTile(x, y) {
    const tile = this.tileMap[y][x];
    const tileIndex = y * this.tileMap[0].length + x;
    const gameGrid = document.getElementById("gameGrid");

    if (tile === "P") {
      console.log("Player hit by bomb!");

      this.playerMovement.updatePlayerPosition(0, 0);
    } else if (tile === 2) {
      this.tileMap[y][x] = 0; // Destroy Breakable Tile
      gameGrid.children[tileIndex].classList.remove("breakable");
      gameGrid.children[tileIndex].classList.add("floor");
    }
  }
}

const bomb = new Bomb(tileMapDefault, playerMovement, tileTypes); // Pass tileMap and playerMovement

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    // Spacebar
    bomb.plantBomb();
  }
});
