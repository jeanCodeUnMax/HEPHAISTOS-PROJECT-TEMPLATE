// Input module for keyboard controls
const keys = {};

window.addEventListener('keydown', (event) => {
  keys[event.code] = true;
});

window.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});

export function isKeyPressed(keyCode) {
  return !!keys[keyCode];
}

export function getKeys() {
  return keys;
}