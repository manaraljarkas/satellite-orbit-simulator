console.log("✅ animate.js is loaded");

import * as THREE from "three";
import { computeTotalForce } from "./physics/forces.js";
import { computeTorques } from "./physics/torques.js";
import { updateAttitude } from "./physics/integrators.js";
import { attitude } from "./physics/attitude.js";

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

  // دوران الأرض
  earth.rotation.y += 0.001;

  // === حساب القوى الخطية (translational dynamics) ===
  const Fnet = computeTotalForce(state.position, state.velocity);

  const acceleration = Fnet.clone().divideScalar(config.satelliteMass);
  state.velocity.add(acceleration.clone().multiplyScalar(dt));
  state.position.add(state.velocity.clone().multiplyScalar(dt));

  // === حساب العزوم والدوران (rotational dynamics) ===
  const torque = computeTorques(state, config);
  updateAttitude(dt, torque);

  // === تحديث الرسم ===
  if (satellite) {
    // موقع القمر
    const scaledPosition = state.position.clone().multiplyScalar(SCALE);
    satellite.position.copy(scaledPosition);

    // اتجاه القمر من الكواترنيون
    const [q0, q1, q2, q3] = attitude.q; // q0 = w
    satellite.quaternion.set(q1, q2, q3, q0); // three.js expects (x,y,z,w)
  }

  controls.update();
  renderer.render(scene, camera);
}
