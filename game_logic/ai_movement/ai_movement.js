class AiMovement {
  Player;
  constructor(tileMap, tileTypes) {
    this.tileMap = tileMap;
    this.tileTypes = tileTypes;
    this.aiPosition = this.findAiPosition();
    this.visited = new Set();
    this.startAiMovement();
  }

  findAiPosition() {
    for (let y = 0; y < this.tileMap.length; y++) {
      for (let x = 0; x < this.tileMap[0].length; x++) {
        if (this.tileMap[y][x] === "E") {
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
    return this.tileMap[newY][newX] === 0;
  }

  updateAiPosition(newX, newY) {
    if (!this.isValidMove(newX, newY)) return;

    this.tileMap[this.aiPosition.y][this.aiPosition.x] = 0;
    this.tileMap[newY][newX] = "E";

    const gameGrid = document.getElementById("gameGrid");
    const oldIndex =
      this.aiPosition.y * this.tileMap[0].length + this.aiPosition.x;
    const newIndex = newY * this.tileMap[0].length + newX;

    gameGrid.children[oldIndex].classList.remove("enemy");
    gameGrid.children[oldIndex].classList.add("floor");

    gameGrid.children[newIndex].classList.remove("floor");
    gameGrid.children[newIndex].classList.add("enemy");

    this.aiPosition = { x: newX, y: newY };

    this.visited.add(`${newX},${newY}`);
  }

  findRandomMove() {
    const { x, y } = this.aiPosition;
    const moves = [
      { x: x, y: y - 1 }, // Up
      { x: x, y: y + 1 }, // Down
      { x: x - 1, y: y }, // Left
      { x: x + 1, y: y }, // Right
    ];

    const validMoves = moves.filter(
      (move) =>
        this.isValidMove(move.x, move.y) &&
        !this.visited.has(`${move.x},${move.y}`)
    );

    if (validMoves.length === 0) {
      this.visited.clear(); // Reset memory if blocked
      return moves.find((move) => this.isValidMove(move.x, move.y));
    }

    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  aiMove() {
    const nextMove = this.findRandomMove();
    if (nextMove) {
      this.updateAiPosition(nextMove.x, nextMove.y);
    }
  }

  // plantBanana(canPlant) {
  // //     TODO implement can bomb + dodge
  // }

  // getPlayerPosition(Player) {
  //     return Player.findPlayerPosition()
  // }

  startAiMovement() {
    setInterval(() => this.aiMove(), 900);
  }
}

const aiMovement = new AiMovement(tileMapDefault, tileTypes);
