export default class HealthDisplayComponent {
  constructor(playerId) {
    this.playerId = playerId;
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "10px";
    this.container.style.left = "10px";
    this.container.style.color = "";
    this.container.style.fontSize = "24px";
    this.container.style.fontFamily = "bomberman";
    document.body.appendChild(this.container);
  }

  update(health) {
    this.container.textContent = `Life: ${health}`;
  }
}
