class InputComponent {
  constructor() {
    this.keys = new Set();
    this.keyMap = {
      'q': 'left',
      'd': 'right',
      'z': 'up',
      's': 'down'
    };

    document.addEventListener('keydown', (event) => {
      if (this.keyMap[event.key]) {
        this.addKey(this.keyMap[event.key]);
      }
    });

    document.addEventListener('keyup', (event) => {
      if (this.keyMap[event.key]) {
        this.removeKey(this.keyMap[event.key]);
      }
    });
  }

  addKey(key) {
    this.keys.add(key);
  }

  removeKey(key) {
    this.keys.delete(key);
  }

  update() {
    // Code de gestion des entrées
    console.log("Entrées");
  }
}

export default InputComponent;