import { renderer, camera, scene } from "./scene.js";
import { controls } from "./controls.js";
import { earth } from "./earth.js";
import { satellite } from "./satellite.js";

let angle = 0;

const EARTH_RADIUS = 10;
const ORBIT_ALTITUDE = 5;
const ORBIT_RADIUS = EARTH_RADIUS + ORBIT_ALTITUDE;

export function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.001;

  if (satellite) {
    angle += 0.005;
    satellite.position.x = Math.cos(angle) * ORBIT_RADIUS;
    satellite.position.z = Math.sin(angle) * ORBIT_RADIUS;
  }

  controls.update();
  renderer.render(scene, camera);
}
