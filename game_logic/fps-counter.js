/**
 * The code snippet is a JavaScript function that calculates and displays the frames per second (FPS)
 * of an animation loop running at a capped rate of 60 FPS.
 */
const fpsElem = document.querySelector("#fps");
const fpsCap = 60;
const interval = 1000 / fpsCap;

let then = performance.now();
let frameCount = 0;
let lastFpsUpdate = performance.now();

/**
 * The `render` function updates the frames per second (fps) count every second.
 */
function render() {
  frameCount++;
  let now = performance.now();
  if (now - lastFpsUpdate >= 1000) {
    fpsElem.textContent = frameCount;
    frameCount = 0;
    lastFpsUpdate = now;
  }
}

/**
 * The function `animate` uses `requestAnimationFrame` to render frames at a specified interval.
 * @param [now] - The `now` parameter in the `animate` function is the current timestamp provided by
 * the `performance.now()` method. It is used to calculate the time elapsed since the last frame was
 * rendered.
 */
function animate(now = performance.now()) {
  let delta = now - then;
  if (delta >= interval) {
    then = now - (delta % interval);
    render();
  }
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
