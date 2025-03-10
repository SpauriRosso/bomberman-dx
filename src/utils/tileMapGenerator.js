import { tileset, getTileType } from "../utils/tileset.js";

// Function to generate a tile map
export function generateTileMap(width, height, tileMapPattern) {
  const tileMap = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const tileId =
        tileMapPattern[y] && tileMapPattern[y][x] !== undefined
          ? tileMapPattern[y][x]
          : 0; // Default to floor
      row.push(tileId);
    }
    tileMap.push(row);
  }

  return tileMap;
}

// Example patterns for different tile maps
export const tileMapPatterns = {
  map1: [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  map2: [
    [1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 1],
    [1, 2, 0, 0, 2, 1],
    [1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  map3: [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ],
};
