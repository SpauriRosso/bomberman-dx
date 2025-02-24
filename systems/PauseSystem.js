export default class PauseSystem {
  constructor(gameStateEntity) {
    this.gameStateEntity = gameStateEntity;
    this.isPaused = false;

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key.toLowerCase() === "p") {
        this.togglePause();
        this.isPaused = !this.isPaused;
      }
    });
  }

  togglePause() {
    const pauseComponent = this.gameStateEntity.getComponent("Pause");
    pauseComponent.isPaused = !pauseComponent.isPaused;

    document.dispatchEvent(
      new CustomEvent("pauseToggled", {
        detail: { isPaused: pauseComponent.isPaused },
      })
    );

    if (pauseComponent.isPaused) {
      this.displayPause();
    } else {
      this.removePause();
    }

    console.log(`Pause status: ${pauseComponent.isPaused}`);
  }

  displayPause() {
    if (document.getElementById("pauseScreen")) return; // Évite les doublons

    const pauseScreen = document.createElement("div");
    pauseScreen.id = "pauseScreen";
    pauseScreen.style.position = "absolute";
    pauseScreen.style.background = "rgba(0,0,0,0.5)";
    pauseScreen.style.color = "white";
    pauseScreen.style.display = "flex";
    pauseScreen.style.justifyContent = "center";
    pauseScreen.style.alignItems = "center";
    pauseScreen.style.fontSize = "3em";
    pauseScreen.style.top = "50%";
    pauseScreen.style.left = "50%";
    pauseScreen.style.transform = "translate(-50%, -50%)";
    pauseScreen.style.width = "292px";
    pauseScreen.style.height = "135px";
    pauseScreen.style.background = "rgba(209, 196, 233, 0.29)";
    pauseScreen.style.borderRadius = "10px";
    pauseScreen.style.border = "1px solid #ffffff";
    pauseScreen.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.5)";
    pauseScreen.style.backdropFilter = "blur(29px)";
    pauseScreen.style.display = "flex";
    pauseScreen.style.flexDirection = "column";
    pauseScreen.style.alignItems = "center";
    pauseScreen.style.justifyContent = "center";
    pauseScreen.style.padding = "15px";
    pauseScreen.style.zIndex = "1000";

    const pauseText = document.createElement("div");
    pauseText.innerText = "PAUSE";
    pauseText.style.color = "#ffffff";
    pauseText.style.fontFamily = "bomberman";
    pauseText.style.fontSize = "48px";
    pauseText.style.fontWeight = "500";
    pauseText.style.textShadow = "0px 4px 4px rgba(0, 0, 0, 0.25)";
    pauseScreen.appendChild(pauseText);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "20px";
    buttonContainer.style.marginTop = "20px";

    const pauseButton = document.createElement("img");
    pauseButton.src = "./pictures/pause-assests/Pause-Button.png";
    pauseButton.style.width = "49px";
    pauseButton.style.height = "49px";
    pauseButton.style.cursor = "pointer";
    pauseButton.addEventListener("click", () => this.togglePause());

    const resetButton = document.createElement("img");
    resetButton.src = "./pictures/pause-assests/Reset.png";
    resetButton.style.width = "49px";
    resetButton.style.height = "49px";
    resetButton.style.cursor = "pointer";
    resetButton.addEventListener("click", () => window.location.reload());

    // Bouton pour retourner au menu principal
    const mainMenuButton = document.createElement("img");
    mainMenuButton.src = "./pictures/pause-assests/Cancel.png";
    mainMenuButton.style.width = "49px";
    mainMenuButton.style.height = "49px";
    mainMenuButton.style.cursor = "pointer";
    mainMenuButton.addEventListener(
      "click",
      () => (window.location.href = "mainmenu.html")
    );

    buttonContainer.appendChild(pauseButton);
    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(mainMenuButton);
    pauseScreen.appendChild(buttonContainer);
    document.getElementById("gameGrid").appendChild(pauseScreen);
  }

  removePause() {
    const pauseScreen = document.getElementById("pauseScreen");
    if (pauseScreen) {
      pauseScreen.remove();
    }
  }

  update() {}
}
