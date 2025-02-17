<<<<<<< HEAD
=======
// export default class EnemyComponent {
//   constructor() {
//     this.aiBehavior = "random";
//   }
>>>>>>> 47bb7f50804bf79041ecb142c8823a2f9334baf9
export default class EnemyComponent {
  constructor() {
    this.aiBehavior = "random";
    this.x = 0;
    this.y = 0;

    this.moves = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 }, // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 }, // Right
    ];
  }
  /**
   * Generate random movement
   * @return {object} - {x, y} for movement attempt
   */
  getRandMove() {
    return this.moves[Math.floor(Math.random() * this.moves.length)];
  }

  update() {
    let move = this.getRandMove();
    this.x = move.x;
    this.y = move.y;
  }
}
