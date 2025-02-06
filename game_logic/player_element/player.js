const character = document.getElementById("character");

let frame = 0;
const frameSequence = [0, 1, 2]; // Utilisation complète des 3 frames
const frameWidth = 64;
const frameHeight = 64;
const speed = 10;

let direction = 0; // Direction actuelle du joueur
let isMoving = false;
let moveInterval = null;
let frameIndex = 0;

const directionMap = {
    ArrowDown: 0,  // Bas → Ligne 0
    ArrowUp: 1,    // Haut → Ligne 1
    ArrowLeft: 2,  // Gauche → Ligne 2
    ArrowRight: 5  // Droite → Ligne 5
};

function animate() {
    if (isMoving) {
        // Alterne entre frame 0 → 1 → 2 en boucle
        frame = frameSequence[frameIndex];
        frameIndex = (frameIndex + 1) % frameSequence.length; // Boucle sur 0 → 1 → 2 → 0 → 1 → 2...

        const posX = -frame * frameWidth;
        const posY = -direction * frameHeight;
        character.style.backgroundPosition = `${posX}px ${posY}px`;
    }
}

// Boucle d’animation toutes les 150ms
setInterval(animate, 150);

document.addEventListener("keydown", (event) => {
    if (directionMap.hasOwnProperty(event.key)) {
        if (!isMoving) {
            isMoving = true;
            frameIndex = 0; // Démarre toujours avec la frame 0
        }

        direction = directionMap[event.key]; // Met à jour la direction du sprite

        if (!moveInterval) {
            moveInterval = setInterval(() => {
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
            }, 50); // Déplacement plus fluide
        }
    }
});

document.addEventListener("keyup", (event) => {
    if (directionMap.hasOwnProperty(event.key)) {
        isMoving = false;
        clearInterval(moveInterval);
        moveInterval = null;

        // Remettre la frame statique (0) quand on relâche la touche
        frame = 0;
        const posX = -frame * frameWidth;
        const posY = -direction * frameHeight;
        character.style.backgroundPosition = `${posX}px ${posY}px`;
    }
});
