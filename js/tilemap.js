class Tilemap {
  constructor() {
    this.grid = [];
    this.element = document.getElementById("tilemap");
    this.generateMap();
  }

  generateMap() {
    for (let y = 0; y < 14; y++) {
      this.grid[y] = [];
      for (let x = 0; x < 15; x++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");

        // Create walls around the edges
        // Randomizers
        if (x === 0 || x === 14 || y === 0 || y === 10) {
          tile.classList.add("wall");
        }

        // Create some breakable blocks
        if (this.shouldCreateBreakableBlock(x, y)) {
          tile.classList.add("breakable");
        }

        this.grid[y][x] = tile;
        this.element.appendChild(tile);
      }
    }
  }

  shouldCreateBreakableBlock(x, y) {
    // Avoid player start area and create random breakable blocks
    if ((x <= 2 && y <= 2) || (x >= 12 && y >= 50)) return false;
    return Math.random() < 0.3 && x % 2 !== 0 && y % 2 !== 0;
  }

  getTileAt(x, y) {
    return this.grid[y][x];
  }
}
