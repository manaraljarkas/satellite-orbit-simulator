import { camera, renderer } from "./environment/scene.js";
import { animate } from "./animate.js";
import './gui/gui.js';
import './environment/satellite.js';
import { initWarningSound, primeWarningSound } from "./environment/sound.js";

// تهيئة الصوت (ملف الإنذار)
initWarningSound('warning.mp3');

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 🟢 أول نقرة للمستخدم ترفع الحظر
window.addEventListener("click", () => {
  primeWarningSound();
}, { once: true });

// Start loop
animate();
