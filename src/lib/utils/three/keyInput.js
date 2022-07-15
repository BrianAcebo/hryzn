import { browser } from '$app/env';


// Add arrow key controls on verse meta edit


class KeyInput {
  constructor() {
    this.keys = {};
    if (browser) {
      window.addEventListener("keydown", this.down.bind(this));
      window.addEventListener("keyup", this.up.bind(this));
    }
  }

  isPressed(keyCode) {
    return this.keys[keyCode] ? this.keys[keyCode] : false;
  }

  down(e) {
    e.preventDefault();
    if (this.keys[e.keyCode]) return;
    this.keys[e.keyCode] = true;
  }

  up(e) {
    e.preventDefault();
    this.keys[e.keyCode] = false;
  }
}

const keyInput = new KeyInput();

export default keyInput;
