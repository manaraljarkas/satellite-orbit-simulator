import { camera, renderer } from "./environment/scene.js";
import { animate } from "./animate.js";
import './gui/gui.js';
import './environment/satellite.js';
import { initWarningSound, primeWarningSound } from "./environment/sound.js";

initWarningSound('warning.mp3');

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


window.addEventListener("click", () => {
  primeWarningSound();
}, { once: true });


animate();
