import { renderer, camera, scene } from "./environment/scene.js";
import { controls } from "./environment/controls.js";
import { earth } from "./environment/earth.js";
import { satellite } from "./environment/satellite.js";
import { ORBIT_RADIUS } from "./physics/constants.js";
import { params } from "./gui/params.js";

let angle = 0;

export function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.001;

  if (satellite) {
   // angle += 0.005;
    angle += (params.velocity / params.radius) * 0.1;

    satellite.position.x = Math.cos(angle) * ORBIT_RADIUS;
    satellite.position.z = Math.sin(angle) * ORBIT_RADIUS;
  }

  controls.update();
  renderer.render(scene, camera);
}
