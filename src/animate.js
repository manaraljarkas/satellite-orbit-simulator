console.log("✅ animate.js is loaded");

import * as THREE from "three";
import { computeTotalForce } from "./physics/forces.js";
import { state } from "./physics/state.js";
import { camera } from "./environment/scene.js";
import { earth } from "./environment/earth.js";
import { satellite } from "./environment/satellite.js";
import { renderer, scene } from "./environment/scene.js";
import { controls } from "./environment/controls.js";
import { SCALE } from "./physics/constants.js";
import { config } from "./physics/config.js";

const dt = config.dt;

export function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.001;

  // محصلة القوى
  const Fnet = computeTotalForce(
    state.position,
    state.velocity
  );

  // تسارع
  const acceleration = Fnet.clone().divideScalar(config.satelliteMass);

  // تحديث السرعة
  state.velocity.add(acceleration.clone().multiplyScalar(dt));

  // تحديث الموقع
  state.position.add(state.velocity.clone().multiplyScalar(dt));

  // تحديث الرسم
  if (satellite) {
    const scaledPosition = state.position.clone().multiplyScalar(SCALE);
    satellite.position.copy(scaledPosition);
    satellite.lookAt(new THREE.Vector3(0, 0, 0));
  }

  controls.update();
  renderer.render(scene, camera);
}