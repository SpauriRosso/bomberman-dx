class inputsComponents {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.fire = false;

    window.addEventListener("keydown", (event) => {
      console.log("keydown pressed", event);

      switch (event.key) {
        case "ArrowLeft":
        case "q":
        case "a":
          this.left = true;
          break;
        case "ArrowRight":
        case "d":
          this.right = true;
          break;
        case "ArrowUp":
        case "z":
        case "w":
          this.up = true;
          break;
        case "ArrowDown":
        case "s":
          this.down = true;
          break;
        case " ":
          this.fire = true;
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      console.log("keyup pressed", event);
      switch (event.key) {
        case "ArrowLeft":
        case "q":
        case "a":
          this.left = false;
          break;
        case "ArrowRight":
        case "d":
          this.right = false;
          break;
        case "ArrowUp":
        case "z":
        case "w":
          this.up = false;
          break;
        case "ArrowDown":
        case "s":
          this.down = false;
          break;
        case " ":
          this.fire = false;
          break;
      }
    });
  }

  // Add a new method to update the player's position
  updatePlayerPosition(player) {
    if (this.up) {
      player.y -= 1;
    }
    if (this.down) {
      player.y += 1;
    }
    if (this.left) {
      player.x -= 1;
    }
    if (this.right) {
      player.x += 1;
    }
  }
}
export default inputsComponents;
