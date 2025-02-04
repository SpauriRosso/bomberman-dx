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
        break;
    }
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }
}

// Initialize player movement
const playerMovement = new PlayerMovement(tileMapDefault, tileTypes);
