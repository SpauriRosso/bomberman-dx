import Entity from "./Entity.js";
import PauseComponent from "../Components/PauseComponent.js";

export default function createGameStatEntity() {
  const gameStateEntity = new Entity("gameState");
  gameStateEntity.addComponent("Pause", new PauseComponent());
  return gameStateEntity;
}
