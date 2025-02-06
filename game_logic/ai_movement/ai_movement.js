class AiMovement {
  constructor(tileMap, tileTypes) {
    this.tileMap = tileMap;
    this.tileTypes = tileTypes;
    this.initialEnemyPositions = this.findAllEnemyPositions();
    this.enemies = this.initialEnemyPositions.map((pos) => ({
      position: pos,
      isAlive: true,
    }));
    this.movementIntervals = {};
    this.startAllEnemyMovement();
  }

  // Find All Enemy Positions
  findAllEnemyPositions() {
    const enemyPositions = [];
    for (let y = 0; y < this.tileMap.length; y++) {
      for (let x = 0; x < this.tileMap[0].length; x++) {
        if (this.tileMap[y][x] === "E") {
          enemyPositions.push({ x, y });
        }
      }
    }
    return enemyPositions;
  }

  // Validate Move
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

  // Update AI Position
  updateAiPosition(enemyIndex, newX, newY) {
    const enemy = this.enemies[enemyIndex];
    if (!enemy.isAlive || !this.isValidMove(newX, newY)) return;

    const { x, y } = enemy.position;
    this.tileMap[y][x] = 0;
    this.tileMap[newY][newX] = "E";

    const gameGrid = document.getElementById("gameGrid");
    const oldIndex = y * this.tileMap[0].length + x;
    const newIndex = newY * this.tileMap[0].length + newX;

    gameGrid.children[oldIndex].classList.remove("enemy");
    gameGrid.children[oldIndex].classList.add("floor");

    gameGrid.children[newIndex].classList.remove("floor");
    gameGrid.children[newIndex].classList.add("enemy");

    enemy.position = { x: newX, y: newY };
  }

  // Find Random Move
  findRandomMove(enemyIndex) {
    const enemy = this.enemies[enemyIndex];
    if (!enemy.isAlive) return null;

    const { x, y } = enemy.position;
    const moves = [
      { x: x, y: y - 1 }, // Up
      { x: x, y: y + 1 }, // Down
      { x: x - 1, y: y }, // Left
      { x: x + 1, y: y }, // Right
    ];

    const validMoves = moves.filter((move) => this.isValidMove(move.x, move.y));

    return validMoves.length > 0
      ? validMoves[Math.floor(Math.random() * validMoves.length)]
      : null;
  }

  // AI Move
  aiMove(enemyIndex) {
    const nextMove = this.findRandomMove(enemyIndex);
    if (nextMove) {
      this.updateAiPosition(enemyIndex, nextMove.x, nextMove.y);
    }
  }

  // Handle Bomb Hit
  handleBombHit(bombX, bombY) {
    const enemyIndex = this.enemies.findIndex(
      (enemy) =>
        enemy.isAlive &&
        enemy.position.x === bombX &&
        enemy.position.y === bombY
    );

    if (enemyIndex === -1) return;

    const enemy = this.enemies[enemyIndex];
    const { x, y } = enemy.position;

    // Remove from tilemap
    this.tileMap[y][x] = 0;

    // Update game grid
    const gameGrid = document.getElementById("gameGrid");
    const index = y * this.tileMap[0].length + x;
    gameGrid.children[index].classList.remove("enemy");
    gameGrid.children[index].classList.add("floor");

    // Stop movement for this enemy
    if (this.movementIntervals[enemyIndex]) {
      clearInterval(this.movementIntervals[enemyIndex]);
      delete this.movementIntervals[enemyIndex];
    }

    enemy.isAlive = false;
  }

  // Start All Enemy Movement
  startAllEnemyMovement() {
    this.enemies.forEach((enemy, index) => {
      this.movementIntervals[index] = setInterval(() => {
        if (enemy.isAlive) {
          this.aiMove(index);
        }
      }, 900);
    });
  }
}

const aiMovement = new AiMovement(tileMapDefault, tileTypes);
