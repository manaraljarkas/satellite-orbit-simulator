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
import { SCALE, EARTH_RADIUS } from "./physics/constants.js";
import { config } from "./physics/config.js";
import { createExplosion } from "./environment/explosion.js";
import { removeSatellite } from "./environment/satellite.js";

export function animate() {
  requestAnimationFrame(animate);

  // دوران الأرض
  earth.rotation.y += 0.001;

  // === حساب القوى الخطية (translational dynamics) ===
  const Fnet = computeTotalForce(state.position, state.velocity);

  const acceleration = Fnet.clone().divideScalar(config.satelliteMass);

  // تحديث السرعة
  state.velocity.add(acceleration.clone().multiplyScalar(config.dt));

  // تحديث الموقع
  state.position.add(state.velocity.clone().multiplyScalar(config.dt));

  // تحديث الرسم مع فحص التصادم
  if (satellite) {
    // موقع القمر
    const scaledPosition = state.position.clone().multiplyScalar(SCALE);
    satellite.position.copy(scaledPosition);
    satellite.lookAt(new THREE.Vector3(0, 0, 0));

    // فحص التصادم مع الأرض
    const distanceFromCenter = scaledPosition.length();
    const earthVisualRadius = EARTH_RADIUS * 0.6; // نفس scale المستخدم في earth.js

    if (distanceFromCenter <= earthVisualRadius) {
      console.log('💥 تصادم! القمر الصناعي اصطدم بالأرض');

      // إنشاء انفجار في موقع التصادم
      createExplosion(scaledPosition, {
        particleCount: 300,
        color: 0xff4444,
        size: 0.3,
        durationMs: 2000
      });

      // إزالة القمر الصناعي
      removeSatellite();
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
