class PlayerMovement {
  constructor(tileMap, tileTypes) {
    this.tileMap = tileMap;
    this.tileTypes = tileTypes;
    this.playerPosition = this.findPlayerPosition();
    this.setupEventListeners();
  }

  findPlayerPosition() {
    for (let y = 0; y < this.tileMap.length; y++) {
      for (let x = 0; x < this.tileMap[y].length; x++) {
        if (this.tileMap[y][x] === "P") {
          return { x, y };
        }
      }
    }
    return null;
  }

  isValidMove(newX, newY) {
    if (
      newY < 0 ||
      newY >= this.tileMap.length ||
      newX < 0 ||
      newX >= this.tileMap[0].length
    ) {
      return false;
    }

    const targetTile = this.tileMap[newY][newX];
    return targetTile === 0;
  }

  updatePlayerPosition(newX, newY) {
    if (!this.isValidMove(newX, newY)) return;

    this.tileMap[this.playerPosition.y][this.playerPosition.x] = 0;
    this.tileMap[newY][newX] = "P";

    const gameGrid = document.getElementById("gameGrid");
    const oldIndex =
      this.playerPosition.y * this.tileMap[0].length + this.playerPosition.x;
    const newIndex = newY * this.tileMap[0].length + newX;

    gameGrid.children[oldIndex].classList.remove("player");
    gameGrid.children[oldIndex].classList.add("floor");
    gameGrid.children[newIndex].classList.remove("floor");
    gameGrid.children[newIndex].classList.add("player");

    this.playerPosition = { x: newX, y: newY };
  }

  handleKeyPress(e) {
    const { x, y } = this.playerPosition;
    console.log("key was pressed: " + e.key);

    switch (e.key) {
      case "ArrowUp":
      case "z":
      case "w":
        this.updatePlayerPosition(x, y - 1);
        break;
      case "ArrowDown":
      case "s":
        this.updatePlayerPosition(x, y + 1);
        break;
      case "ArrowLeft":
      case "q":
      case "a":
        this.updatePlayerPosition(x - 1, y);
        break;
      case "ArrowRight":
      case "d":
        this.updatePlayerPosition(x + 1, y);
        break;
      case " ":
        this.launchBomb(x, y); // Launch bomb when space is pressed
        break;
    }
  }
  launchBomb(x, y) {
    // Get the tile where the bomb is placed
    const gameGrid = document.getElementById("gameGrid");
    const index = y * this.tileMap[0].length + x;
    const bombTile = gameGrid.children[index];

    // Create an image element
    const bombImg = document.createElement("img");
    bombImg.src = "./pictures/bomb.png"; // Path to your bomb image
    bombImg.classList.add("bomb-img"); // Optionally add a class for styling

    // Clear the existing tile contents (if any) and add the bomb image
    bombTile.innerHTML = ""; // Clear previous content
    bombTile.appendChild(bombImg);

    // Set bomb timer to explode after 2 seconds
    setTimeout(() => {
      this.explodeBomb(x, y, bombTile); // Call explode function after timer ends
    }, 2000);
  }

  explodeBomb(x, y, bombTile) {
    console.log("Bomb exploded at", x, y);

    // Change the bomb tile to an explosion
    bombTile.classList.remove("bomb"); // Remove bomb class
    bombTile.classList.add("explosion"); // Add explosion class

    // Simple explosion logic to affect tiles around the bomb
    const explosionRange = 1; // Explosion radius (1 tile in each direction)

    // Affect the tile where the bomb is placed
    this.updateExplosionTile(x, y);

    // Affect tiles around the bomb within the explosion range
    for (let dx = -explosionRange; dx <= explosionRange; dx++) {
      for (let dy = -explosionRange; dy <= explosionRange; dy++) {
        if (Math.abs(dx) + Math.abs(dy) <= explosionRange) {
          const newX = x + dx;
          const newY = y + dy;
          if (this.isValidMove(newX, newY)) {
            this.updateExplosionTile(newX, newY);
          }
        }
      }
    }
  }

  updateExplosionTile(x, y) {
    // Change the tile to indicate explosion (could be 'X' for exploded tile)
    if (this.tileMap[y] && this.tileMap[y][x] !== undefined) {
      this.tileMap[y][x] = "X"; // Change the tile to 'X' (explosion)
    }

    // Update visual representation of the explosion on the grid
    const gameGrid = document.getElementById("gameGrid");
    const index = y * this.tileMap[0].length + x;
    gameGrid.children[index].classList.remove("floor");
    gameGrid.children[index].classList.add("explosion"); // Add explosion class
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }
}

// Initialize player movement
const playerMovement = new PlayerMovement(tileMapDefault, tileTypes);
