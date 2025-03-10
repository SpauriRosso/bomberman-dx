export const tileset = {
  0: "floor",
  1: "wall",
  2: "breakable",
  3: "mapWall",
  P: "player",
  I: "enemy",
  // Add more tile types as needed
};

// Function to get tile type by ID
export function getTileType(id) {
  return tileset[id] || "unknown";
}
