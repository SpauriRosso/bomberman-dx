// import { tileMapDefault, tileTypes } from "./tileMap.js";

export default class GridUpdateSystem {
  constructor() {
    this.grid = null;
  }

  update(grid) {
    // console.log("Grid data updated:", grid);
    this.grid = grid;
  }
}
