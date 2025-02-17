// Définir la tileMap par défaut
export const tileMapDefault = [
  // Default tile map definition
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, "I", 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, "I", 1],
  [1, 0, 3, 2, 3, 2, 3, 2, 3, 2, 3, 0, 3, 0, 1],
  [1, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 0, 3, 0, 1],
  [1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 1],
  [1, 2, 3, 2, 3, 2, 3, 0, 3, 2, 3, 0, 3, 0, 1],
  [1, 2, 0, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 1],
  [1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 0, 3, 2, 1],
  [1, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 1],
  [1, 0, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 0, 1],
  [1, "P", 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, "I", 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Types des cases
const tileTypes = {
  0: "floor",
  1: "wall",
  2: "breakable",
  3: "mapWall",
  P: "player",
  I: "enemy",
};

// Fonction pour générer la grille à partir de la tileMap
function generateGrid() {
  const gameGrid = document.createElement("div");
  gameGrid.id = "gameGrid";
  if (!gameGrid) alert("Erreur : l'élément gameGrid est introuvable !");
  gameGrid.innerHTML = "";
  gameGrid.style.gridTemplateColumns = `repeat(${tileMapDefault[0].length}, 64px)`;
  gameGrid.style.gridTemplateRows = `repeat(${tileMapDefault.length}, 64px)`;

  // Créer les éléments pour chaque tuile dans la tileMap
  tileMapDefault.forEach((row) => {
    row.forEach((cell) => {
      const tile = document.createElement("div");
      tile.classList.add("tile", tileTypes[cell]);
      gameGrid.appendChild(tile);
    });
  });
  document.getElementById("game-container").appendChild(gameGrid);
  console.log(
    `Game Grid Size: ${tileMapDefault[0].length}x${tileMapDefault.length}`
  );
}

// Fonction pour trouver la position actuelle du joueur (P)
function findPlayerPosition() {
  for (let y = 0; y < tileMapDefault.length; y++) {
    for (let x = 0; x < tileMapDefault[y].length; x++) {
      if (tileMapDefault[y][x] === "P") {
        return { x, y };
      }
    }
  }
  return null; // Si le joueur n'est pas trouvé
}

function findEnemyPosition() {
  let coordinates = [];
  for (let y = 0; y < tileMapDefault.length; y++) {
    for (let x = 0; x < tileMapDefault[y].length; x++) {
      if (tileMapDefault[y][x] === "I") {
        coordinates.push({ x, y });
      }
    }
  }
  if (coordinates.length === 0) {
    return null;
  } else {
    return coordinates;
  }
}

export { findPlayerPosition, findEnemyPosition, generateGrid };
