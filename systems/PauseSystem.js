export default class PauseSystem {
    constructor(gameStateEntity) {
        this.gameStateEntity = gameStateEntity;

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" || e.key === "p" || e.key === "P") {
                this.togglePause();
            }
        });
    }

    togglePause() {
        const pauseComponent = this.gameStateEntity.getComponent("Pause");
        pauseComponent.isPaused = !pauseComponent.isPaused;

        const menu = document.getElementById("pause-menu");
        if (menu) {
            menu.style.display = pauseComponent.isPaused ? "block" : "none";
        }
    }

    update() {
    }
}
