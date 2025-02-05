const tileMapDefault = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, "P", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "E", 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, "E", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "E", 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const tileTypes = {
  0: "floor",
  1: "wall",
  2: "breakable",
  3: "mapWall",
  P: "player",
  E: "enemy",
};

function generateGrid() {
  const gameGrid = document.getElementById("gameGrid");
  gameGrid.innerHTML = "";
  gameGrid.style.gridTemplateColumns = `repeat(${tileMapDefault[0].length}, 64px)`;
  gameGrid.style.gridTemplateRows = `repeat(${tileMapDefault.length}, 64px)`;

  tileMapDefault.forEach((row) => {
    row.forEach((cell) => {
      const tile = document.createElement("div");
      tile.classList.add("tile", tileTypes[cell]);
      gameGrid.appendChild(tile);
    });
  });
}
generateGrid();
