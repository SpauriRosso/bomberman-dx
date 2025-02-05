class Bomb {
  constructor(tileMap, playerMovement, tileTypes) {
    this.tileMap = tileMap;
    this.playerMovement = playerMovement;
    this.tileTypes = tileTypes;
    this.bombPosition = null;
    this.isPlanted = false;
    this.explosionLength = 1; // How far the explosion extends horizontally
  }

  plantBomb() {
    if (this.isPlanted) return;

    this.bombPosition = { ...this.playerMovement.playerPosition };
    this.isPlanted = true;

    this.tileMap[this.bombPosition.y][this.bombPosition.x] = "B";
    const bombIndex =
      this.bombPosition.y * this.tileMap[0].length + this.bombPosition.x;
    const bombElement = document.getElementById("gameGrid").children[bombIndex];

    const bombImage = document.createElement("img");
    bombImage.src = "/pictures/bomb.png";
    bombImage.classList.add("bomb-image");
    bombImage.classList.add("bomb-pulse");
    bombImage.style.width = "100%";
    bombImage.style.height = "100%";
    bombImage.style.objectFit = "contain";

    bombElement.innerHTML = "";
    bombElement.appendChild(bombImage);
    bombElement.classList.add("bomb");

    setTimeout(() => {
      this.detonateBomb();
    }, 3000);
  }

  detonateBomb() {
    if (!this.isPlanted) return;

    const { x, y } = this.bombPosition;

    // Clear bomb from tileMap and grid
    this.tileMap[y][x] = 0;
    const bombIndex = y * this.tileMap[0].length + x;
    const bombElement = document.getElementById("gameGrid").children[bombIndex];
    bombElement.classList.remove("bomb");
    bombElement.classList.add("floor");

    // Create explosion at bomb position
    this.explodeTile(x, y);
    this.visualExplosion(x, y);

    // Only horizontal directions: right and left
    const directions = [
      [1, 0],
      [-1, 0],
    ];

    // For each direction (left and right), extend the explosion
    directions.forEach(([dx, dy]) => {
      const blastX = x + dx;
      const blastY = y;

      if (this.isValidBlast(blastX, blastY)) {
        const tile = this.tileMap[blastY][blastX];
        if (tile !== 1 && tile !== 3) {
          // If not a wall
          this.explodeTile(blastX, blastY);
          this.visualExplosion(blastX, blastY);
        }
      }
    });

    this.isPlanted = false;
    this.bombPosition = null;
  }

  visualExplosion(x, y) {
    const tile = this.tileMap[y][x];
    if (tile === 1 || tile === 3) return;

    const explosionIndex = y * this.tileMap[0].length + x;
    const explosionElement =
      document.getElementById("gameGrid").children[explosionIndex];

    const explosionImage = document.createElement("img");
    explosionImage.src = "/pictures/explosion.png";
    explosionImage.classList.add("explosion-image");
    explosionImage.classList.add("explosion-blast");
    explosionImage.style.width = "100%";
    explosionImage.style.height = "100%";
    explosionImage.style.objectFit = "contain";

    explosionElement.innerHTML = "";
    explosionElement.appendChild(explosionImage);
    explosionElement.classList.add("explosion");

    setTimeout(() => {
      explosionElement.classList.remove("explosion");
      explosionElement.innerHTML = "";
      explosionElement.classList.add("floor");
    }, 700);
  }

  isValidBlast(x, y) {
    return (
      y >= 0 && y < this.tileMap.length && x >= 0 && x < this.tileMap[0].length
    );
  }

  explodeTile(x, y) {
    const tile = this.tileMap[y][x];
    if (tile === 1 || tile === 3) return;

    const tileIndex = y * this.tileMap[0].length + x;
    const gameGrid = document.getElementById("gameGrid");

    if (tile === "P") {
      console.log("Player hit by bomb!");
      this.playerMovement.updatePlayerPosition(0, 0);
    } else if (tile === 2) {
      this.tileMap[y][x] = 0;
      gameGrid.children[tileIndex].classList.remove("breakable");
      gameGrid.children[tileIndex].classList.add("floor");
    }
  }
}

const bomb = new Bomb(tileMapDefault, playerMovement, tileTypes);

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    bomb.plantBomb();
  }
});
