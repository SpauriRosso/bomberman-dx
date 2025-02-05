class Bomb {
  constructor(tileMap, playerMovement, tileTypes) {
    this.tileMap = tileMap;
    this.playerMovement = playerMovement;
    this.tileTypes = tileTypes;
    this.bombPosition = null;
    this.isPlanted = false;
    this.explosionLength = 7;
  }

  isWall(x, y) {
    if (!this.isValidBlast(x, y)) return true;
    const tile = this.tileMap[y][x];
    return tile === 1 || tile === 3;
  }

  getExplosionDirection(x, y) {
    // Check all four directions
    const up = this.isWall(x, y - 1);
    const down = this.isWall(x, y + 1);
    const left = this.isWall(x - 1, y);
    const right = this.isWall(x + 1, y);

    // Count blocked directions
    const blockedCount = [up, down, left, right].filter(
      (blocked) => blocked
    ).length;

    // If three directions are blocked, explode in the only available direction
    if (blockedCount === 3) {
      if (!up) return [[0, -1]]; // Explode up
      if (!down) return [[0, 1]]; // Explode down
      if (!left) return [[-1, 0]]; // Explode left
      if (!right) return [[1, 0]]; // Explode right
    }

    // If all directions are blocked, no explosion extends beyond center
    if (blockedCount === 4) {
      return [];
    }

    // Prefer horizontal explosion if available
    if (!left && !right && !up) {
      return [
        [-1, 0],
        [1, 0],
        [0, -1],
      ];
    } else if (!left) {
      return [[-1, 0]];
    } else if (!right) {
      return [[1, 0]];
    } else if (!up) return [[0, -1]];

    // If horizontal is blocked but vertical is available
    if (!up && !down) {
      return [
        [0, -1],
        [0, 1],
      ];
    } else if (!up) {
      return [[0, -1]];
    } else if (!down) {
      return [[0, 1]];
    }

    // Fallback to no explosion beyond center
    return [];
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
    this.tileMap[y][x] = 0;

    const bombIndex = y * this.tileMap[0].length + x;
    const bombElement = document.getElementById("gameGrid").children[bombIndex];
    bombElement.classList.remove("bomb");
    bombElement.classList.add("floor");

    // Create explosion at the center
    this.explodeTile(x, y);
    this.visualExplosion(x, y, "center");

    // Explosion directions
    const directions = [
      [0, -1], // Up
      [0, 1], // Down
      [-1, 0], // Left
      [1, 0], // Right
    ];

    for (const [dx, dy] of directions) {
      for (let i = 1; i <= this.explosionLength; i++) {
        const blastX = x + dx * i;
        const blastY = y + dy * i;

        if (!this.isValidBlast(blastX, blastY)) break;

        const tile = this.tileMap[blastY][blastX];

        if (tile === 1 || tile === 3) break; // Stop at walls

        this.explodeTile(blastX, blastY);

        // Determine sprite based on direction
        const isLastTile =
          i === this.explosionLength ||
          this.tileMap[blastY + dy]?.[blastX + dx] === 1;
        const spriteType = isLastTile
          ? "end"
          : dx !== 0
          ? "horizontal"
          : "vertical";

        this.visualExplosion(blastX, blastY, spriteType);

        if (tile === 2) break; // Stop at breakable tiles
      }
    }

    this.isPlanted = false;
    this.bombPosition = null;
  }
  visualExplosion(x, y, type) {
    const explosionIndex = y * this.tileMap[0].length + x;
    const explosionElement =
      document.getElementById("gameGrid").children[explosionIndex];

    const explosionImage = document.createElement("img");

    const explosionSprites = {
      center: "/pictures/explosion.png",
      horizontal: "/pictures/explosion.png",
      vertical: "/pictures/explosion.png",
      end: "/pictures/explosion.png",
    };

    explosionImage.src = explosionSprites[type] || explosionSprites["center"];
    explosionImage.classList.add("explosion-image", "explosion-blast");
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
    } else if (tile === "E") {
      console.log("Enemy hit by bomb!");
      this.tileMap[y][x] = 0; // Update tile map to remove enemy
      gameGrid.children[tileIndex].classList.remove("enemy"); // Remove enemy class
      gameGrid.children[tileIndex].classList.add("floor"); // Add floor class
    }
  }
}

const bomb = new Bomb(tileMapDefault, playerMovement, tileTypes);

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    bomb.plantBomb();
  }
});
