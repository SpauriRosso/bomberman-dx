import Entity from "./Entity.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import PlayerDataComponent from "../Components/PlayerDataComponent.js";
import inputsComponent from "../Components/inputsComponents.js";
import SpriteComponent from "../Components/spriteCommponent.js";
import InputSystem from "../systems/InputSystem.js";
import BombSystem from "../systems/BombSystem.js";
import gameStateEntity from "../Components/PauseComponent.js";
import LivesComponent from "../Components/LivesComponent.js";
import HitboxComponent from "../Components/HitboxComponent.js";
import ScoreManager from "../utils/ScoreManager.js";

class PlayerEntity extends Entity {
    constructor(id, x, y, entities) {
        super(id);
        this.id = id;
        this.x = x;
        this.y = y;
        this.entities = entities;
        this.score = 0; // Initialiser le score
        this.bombs = 3; // Initialiser le nombre de bombes
        this.scoreManager = new ScoreManager();

        let velocityComponent = new VelocityComponent(0, 0);
        const inputSystem = new InputSystem();
        const bombSystem = new BombSystem(entities, gameStateEntity);

        this.addComponent("position", new PositionComponent(x, y));
        this.addComponent("velocity", velocityComponent);
        this.addComponent("lives", new LivesComponent(2));
        this.addComponent("data", new PlayerDataComponent());
        this.addComponent("hitbox", new HitboxComponent());

        let spriteComponent = new SpriteComponent({
            ArrowDown: 0, // Bas
            ArrowUp: 1, // Haut
            ArrowLeft: 2, // Gauche
            ArrowRight: 5, // Droite
            s: 0, z: 1, q: 2, d: 5,
        }, id);

        this.addComponent("sprite", spriteComponent);
        this.addComponent("inputs", new inputsComponent(id, spriteComponent, velocityComponent, inputSystem, bombSystem));
    }

    addScore(points) {
        return this.scoreManager.updateScore(points);
    }

    getScore() {
        return this.scoreManager.getScore();
    }
}

export default PlayerEntity;
