const character = document.getElementById("character");

let frame = 0;
const totalFrames = 3; // Nombre total de frames par ligne
const frameWidth = 64;
const frameHeight = 64;
const speed = 10;

let direction = 0; // Valeur qui sera changée selon la direction du joueur
let isMoving = false;

const directionMap = {
    ArrowDown: 0,  // Bas → Ligne 0
    ArrowUp: 1,    // Haut → Ligne 1
    ArrowLeft: 2,  // Gauche → Ligne 
    ArrowRight: 5  // Droite → Ligne 5
};

function animate() {
    if (isMoving) {
        // Animation de frame en boucle (0 → 1 → 2 → 1 → 2 ...)
        frame = (frame + 1) % totalFrames;
        const posX = -frame * frameWidth;
        const posY = -direction * frameHeight;
        character.style.backgroundPosition = `${posX}px ${posY}px`;
    } else {
    }
}

setInterval(animate, 200); // Change d'animation toutes les 200ms


document.addEventListener("keydown", (event) => {
    if (directionMap.hasOwnProperty(event.key)) {
        isMoving = true;
        direction = directionMap[event.key];

        switch (event.key) {
            case "ArrowUp":
                character.style.top = `${character.offsetTop - speed}px`;
                break;
            case "ArrowDown":
                character.style.top = `${character.offsetTop + speed}px`;
                break;
            case "ArrowLeft":
                character.style.left = `${character.offsetLeft - speed}px`;
                break;
            case "ArrowRight":
                character.style.left = `${character.offsetLeft + speed}px`;
                break;
        }
    }
});

document.addEventListener("keyup", () => {
    isMoving = false; // Réinitialiser l'animation lorsque la touche est relâchée
});
