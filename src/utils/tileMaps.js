import { generateTileMap, tileMapPatterns } from "../utils/tileMapGenerator.js";

// Generate the tile maps using the patterns
export const tileMap1 = generateTileMap(6, 5, tileMapPatterns.map1);
export const tileMap2 = generateTileMap(6, 5, tileMapPatterns.map2);
export const tileMap3 = generateTileMap(6, 5, tileMapPatterns.map3);
