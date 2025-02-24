export default class PauseSystem {
    constructor(gameStateEntity) {
        this.gameStateEntity = gameStateEntity;

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" || e.key.toLowerCase() === "p") {
                this.togglePause();
            }
        });
    }

    togglePause() {
        const pauseComponent = this.gameStateEntity.getComponent("Pause");
        pauseComponent.isPaused = !pauseComponent.isPaused;

        document.dispatchEvent(new CustomEvent("pauseToggled", {
            detail: {isPaused: pauseComponent.isPaused}
        }));

        console.log(`Pause status: ${pauseComponent.isPaused}`);
    }

    update() {
    }
}
