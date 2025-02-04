class PlayerMovement {
  constructor(tileMap, tileTypes) {
    this.tileMap = tileMap;
    this.tileTypes = tileTypes;
    this.playerPosition = this.findPlayerPosition();
    this.setupEventListeners();
    this.bombs = []; // Array to store active bombs
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
    const bomb = { x, y, timer: 3 }; // Bomb object with position and timer

    // Check if a bomb already exists at this location
    if (
      this.bombs.some(
        (existingBomb) => existingBomb.x === x && existingBomb.y === y
      )
    ) {
      return; // Prevent placing multiple bombs on the same spot
    }

    this.bombs.push(bomb);
    this.tileMap[y][x] = "B"; // Mark bomb on tile map

    const gameGrid = document.getElementById("gameGrid");
    const bombIndex = y * this.tileMap[0].length + x;
    gameGrid.children[bombIndex].classList.add("bomb");

    const bombTimerInterval = setInterval(() => {
      bomb.timer--;
      if (bomb.timer <= 0) {
        this.explodeBomb(bomb);
        clearInterval(bombTimerInterval);
      }
    }, 1000); // Bomb explodes after 3 seconds

    console.log("Bomb launched at:", x, y);
  }

  explodeBomb(bomb) {
    const { x, y } = bomb;

    // Remove bomb from tileMap and bombs array
    this.tileMap[y][x] = 0;
    this.bombs = this.bombs.filter((b) => b !== bomb);

    const gameGrid = document.getElementById("gameGrid");
    const bombIndex = y * this.tileMap[0].length + x;
    gameGrid.children[bombIndex].classList.remove("bomb");
    gameGrid.children[bombIndex].classList.add("floor");

    // Explosion logic (example: destroy adjacent tiles)
    const explosionRadius = 1; // Adjust explosion radius as needed

    for (let i = -explosionRadius; i <= explosionRadius; i++) {
      for (let j = -explosionRadius; j <= explosionRadius; j++) {
        const expX = x + i;
        const expY = y + j;

        if (this.isValidExplosion(expX, expY)) {
          const tileIndex = expY * this.tileMap[0].length + expX;
          const tileElement = gameGrid.children[tileIndex];

          if (this.tileMap[expY][expX] === 0) {
            // Only destroy floor tiles.
            this.tileMap[expY][expX] = "E"; // Mark as explosion
            tileElement.classList.remove("floor");
            tileElement.classList.add("explosion");

            setTimeout(() => {
              if (this.tileMap[expY][expX] === "E") {
                // Only reset if still an explosion
                this.tileMap[expY][expX] = 0; // Reset tile after delay
                tileElement.classList.remove("explosion");
                tileElement.classList.add("floor");
              }
            }, 1000); // Explosion effect duration
          }
        }
      }
    }
  }

  isValidExplosion(x, y) {
    return (
      x >= 0 && x < this.tileMap[0].length && y >= 0 && y < this.tileMap.length
    );
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }
}

// Initialize player movement
const playerMovement = new PlayerMovement(tileMapDefault, tileTypes);
