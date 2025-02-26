class HUDHeader {
  constructor(container) {
    this.container = container;

    // Conteneur principal du HUD
    this.HUDHeader = document.createElement("div");
    this.HUDHeader.style.position = "absolute";
    this.HUDHeader.style.top = "15px";
    this.HUDHeader.style.left = "50%";
    this.HUDHeader.style.transform = "translateX(-50%)";
    this.HUDHeader.style.fontSize = "20px";
    this.HUDHeader.style.cursor = "default";
    this.HUDHeader.style.fontFamily = "bomberman";
    this.HUDHeader.style.display = "flex";
    this.HUDHeader.style.alignItems = "center";
    this.HUDHeader.style.justifyContent = "space-between"; // Espace égal entre les éléments
    this.HUDHeader.style.padding = "20px 40px"; // Ajuster le padding
    this.HUDHeader.style.background =
      "linear-gradient(135deg, #2ecc71, #3498db)"; // Fond dégradé vert et bleu
    this.HUDHeader.style.borderRadius = "20px";
    this.HUDHeader.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.3)";
    this.HUDHeader.style.border = "2px solid #ffffff"; // Bordure blanche
    this.HUDHeader.style.width = "832px"; // Réduire la largeur du HUD à 832 pixels

    // Effet de texte lumineux
    this.HUDHeader.style.color = "#000000"; // Texte noir
    this.HUDHeader.style.textShadow = "0 2px 4px rgba(0, 0, 0, 0.5)";

    // Score
    this.scoreElement = document.createElement("div");
    this.scoreElement.innerText = "Score: 0";
    this.scoreElement.style.color = "#000000";
    this.scoreElement.style.fontWeight = "bold";

    // Vie
    this.healthElement = document.createElement("div");
    this.healthElement.classList.add("healthElement");
    this.healthElement.style.display = "flex";
    this.healthElement.style.alignItems = "center";
    this.healthElement.style.gap = "10px";

    const heartIcon = document.createElement("img");
    heartIcon.src = "../frontend/assets/pictures/heart.png"; // Path to your heart icon
    heartIcon.style.width = "40px";
    heartIcon.style.height = "40px";
    heartIcon.alt = "Lives";
    heartIcon.style.animation = "heartbeat 1s infinite";

    const lifeCount = document.createElement("span");
    lifeCount.id = "lifeCountText";
    lifeCount.style.color = "#000000";
    lifeCount.style.fontFamily = "bomberman";
    lifeCount.style.fontSize = "20px";
    lifeCount.style.fontWeight = "bold";
    lifeCount.innerText = "2"; // Initialiser le compteur de vie à 2

    this.healthElement.appendChild(heartIcon);
    this.healthElement.appendChild(lifeCount);

    // Timer
    this.timerElement = document.createElement("div");
    this.timerElement.id = "timer";
    this.timerElement.style.color = "#000000";
    this.timerElement.style.fontWeight = "bold";
    this.timerElement.innerText = "00:00"; // Initialiser le timer

    // FPS
    this.fpsElement = document.createElement("div");
    this.fpsElement.id = "fps";
    this.fpsElement.style.color = "#000000";
    this.fpsElement.style.fontWeight = "bold";

    // Ajout des éléments au conteneur HUD
    this.HUDHeader.appendChild(this.scoreElement);
    this.HUDHeader.appendChild(this.healthElement);
    this.HUDHeader.appendChild(this.timerElement);
    this.HUDHeader.appendChild(this.fpsElement);

    container.appendChild(this.HUDHeader);

    // Append the heartbeat animation style to the document
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes heartbeat {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  // Mise à jour du score
  updateScore(newScore) {
    this.scoreElement.innerText = `Score: ${newScore}`;
  }

  // Mise à jour de la vie
  updateHealth(health) {
    const lifeCountText = this.healthElement.querySelector("#lifeCountText");
    if (lifeCountText) {
      lifeCountText.textContent = `${health}`;
    }
  }

  // Mise à jour du timer
  updateTimer(timeString) {
    this.timerElement.innerText = `${timeString}`;
  }

  // Mise à jour des FPS
  updateFPS(fps) {
    this.fpsElement.innerText = `FPS: ${fps}`;
  }
}

export default HUDHeader;
