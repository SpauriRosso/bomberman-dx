class EnemyAnimationComponent {
    constructor(animation, enemyId, url, velocityComponent) {
        this.enemyId = enemyId;
        this.frame = 0;
        this.frameSequence = [0, 1, 2]; // Frames utilisées
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.speed = 3;
        this.direction = 0; // Direction par défaut (bas)
        this.isMoving = true; // Activer le mouvement
        this.frameIndex = 0;
        this.animation = animation;
        this.lastUpdateTime = 0; // Pour gérer la vitesse de l'animation
        this.sprite = url;
        this.velocityComponent = velocityComponent;
        this.isAnimating = false;
        this.isPaused = false;

        document.addEventListener("pauseToggled", (e) => {
            this.isPaused = e.detail.isPaused;
        })

        this.keys = new Set();
        this.directionMap = this.animation;

        this.simulateKeyPress();
        this.animate();
    }

    simulateKeyPress() {
        // Simuler des touches aléatoires
        this.simulateNextKey();
    }

    simulateNextKey() {
        const direction = Math.floor(Math.random() * 4);
        switch (direction) {
            case 0: // Q
                this.simulateKey("q");
                this.velocityComponent.vx = -this.speed;
                break;
            case 1: // D
                this.simulateKey("d");
                this.velocityComponent.vx = this.speed;
                break;
            case 2: // S
                this.simulateKey("s");
                this.velocityComponent.vy = this.speed;
                break;
            case 3: // Z
                this.simulateKey("z");
                this.velocityComponent.vy = -this.speed;
                break;
        }
    }

    // simulateKey(key) {
    //   // Simuler un événement de touche
    //   this.handleKeyDown({ key });

    //   setTimeout(() => {
    //     this.handleKeyUp({ key });

    //     setTimeout(() => {
    //       this.simulateNextKey();
    //     }, 200);
    //   }, 1000);
    // }

    simulateKey(key) {
        // Simuler un événement de touche
        this.handleKeyDown({key});

        setTimeout(() => {
            this.handleKeyUp({key});

            setTimeout(() => {
                this.simulateNextKey();
            }, Math.random() * (200 - 0) + 0); // Générer un nombre aléatoire entre 1000 et 2000
        }, Math.random() * (2000 - 1000) + 1000); // Générer un nombre aléatoire entre 0 et 200
    }

    handleKeyDown(e) {
        if (!this.directionMap.hasOwnProperty(e.key)) return;

        if (!this.isMoving) {
            this.isMoving = true;
            this.frameIndex = 0; // Commence à la frame 0
        }
        // Met à jour la direction de la sprite sheet
        this.direction = this.directionMap[e.key];
    }

    handleKeyUp(e) {
        this.velocityComponent.vy = 0;
        this.velocityComponent.vx = 0;
        if (!this.directionMap.hasOwnProperty(e.key)) return;

        this.isMoving = false;
        this.frame = 0;
        const posX = -this.frame * this.frameWidth;
        const posY = -this.direction * this.frameHeight;
        const enemyElement = document.getElementById(this.enemyId);
        if (enemyElement) {
            enemyElement.style.backgroundPosition = `${posX}px ${posY}px`;
        }
    }

    animate() {
        setInterval(() => {
            if (this.isPaused === true) return;
            if (!this.isMoving) return;
            // Alterne entre frame 0 → 1 → 2 en boucle
            this.frame = this.frameSequence[this.frameIndex];
            this.frameIndex = (this.frameIndex + 1) % this.frameSequence.length; // Boucle sur 0 → 1 → 2 → 0 → 1 → 2...

            const posX = -this.frame * this.frameWidth;
            const posY = -this.direction * this.frameHeight;
            const enemyElement = document.getElementById(this.enemyId);
            if (enemyElement) {
                enemyElement.style.backgroundPosition = `${posX}px ${posY}px`;
            }
        }, 150);
    }

    update() {
        const now = Date.now();
        if (now - this.lastUpdateTime > 150) {
            if (this.isMoving) {
                this.frame = this.frameSequence[this.frameIndex];
                this.frameIndex = (this.frameIndex + 1) % this.frameSequence.length;
            } else {
                this.frame = 0;
            }
            this.lastUpdateTime = now;
        }

        const posX = -this.frame * this.frameWidth;
        const posY = -this.direction * this.frameHeight;
        const enemyElement = document.getElementById(this.enemyId);
        if (enemyElement) {
            enemyElement.style.backgroundPosition = `${posX}px ${posY}px`;
            enemyElement.style.top = `${
                this.enemyId.getComponent("position").y + this.velocityComponent.vy * 64
            }px`;
            enemyElement.style.left = `${
                this.enemyId.getComponent("position").x + this.velocityComponent.vx * 64
            }px`;
        }
    }
}

export default EnemyAnimationComponent;
