import * as THREE from "three";
import { computeTotalForce } from "./physics/forces.js";
import { state } from "./physics/state.js";
import { camera } from "./environment/scene.js";
import { earth } from "./environment/earth.js";
import { satellite } from "./environment/satellite.js";
import { renderer, scene } from "./environment/scene.js";
import { controls } from "./environment/controls.js";
import { SCALE, EARTH_RADIUS } from "./physics/constants.js";
import { config, params } from "./physics/config.js";
import { createExplosion } from "./environment/explosion.js";
import { removeSatellite } from "./environment/satellite.js";
import { computeTorques } from "./physics/torques.js";
import { updateAttitude } from "./physics/integrators.js";
import { attitude } from "./physics/attitude.js";
import { playWarningSound, stopWarningSound } from "./environment/sound.js";


let collisionDetected = false;
let collisionVelocity = 0;



export function resetCollision() {
  collisionDetected = false;
  collisionVelocity = 0;
}


export function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;

  const Fnet = computeTotalForce(state.position, state.velocity);

  // تسارع - قانون نيوتن الثاني: a = F/m
  const acceleration = Fnet.clone().divideScalar(config.satelliteMass);
  state.velocity.add(acceleration.clone().multiplyScalar(config.dt));
  state.position.add(state.velocity.clone().multiplyScalar(config.dt));

  if (satellite && !collisionDetected) {
    const scaledPosition = state.position.clone().multiplyScalar(SCALE);
    satellite.position.copy(scaledPosition);

    satellite.lookAt(new THREE.Vector3(0, 0, 0));

    if (config.enableRotation) {
      // 🌀 تفعيل الدوران بالكواترنيونات
      const torque = computeTorques(state, config);
      updateAttitude(config.dt, torque, config);

      // --- ضبط السرعة الزاوية + الإنذار ---
      const omega = attitude.omega;
      const omegaMagnitude = Math.sqrt(
        omega[0] * omega[0] +
        omega[1] * omega[1] +
        omega[2] * omega[2]
      );

      // افتراضات آمنة للقيم
      const maxW = (typeof config.maxAngularSpeed === "number") ? config.maxAngularSpeed : Infinity;
      const warnW = (typeof config.warningAngularSpeed === "number") ? config.warningAngularSpeed : Infinity;

      // حد السرعة القصوى
      if (omegaMagnitude > maxW) {
        const scale = maxW / omegaMagnitude;
        attitude.omega = omega.map(w => w * scale);
      }

      // 🎧 تفعيل/إيقاف صوت الإنذار مع hysteresis لتجنب التقطيش
      if (omegaMagnitude > warnW * 1.2) {
        playWarningSound();
      } else if (omegaMagnitude < warnW * 0.8) {
        stopWarningSound();
      }

      const [q0, q1, q2, q3] = attitude.q;
      satellite.quaternion.set(q1, q2, q3, q0);
    } else {
      // 🚫 بدون دوران: القمر يوجّه نفسه نحو مركز الأرض فقط
      satellite.lookAt(new THREE.Vector3(0, 0, 0));
    }


    const distanceFromCenter = scaledPosition.length();
    const earthVisualRadius = EARTH_RADIUS * 0.8;

    if (distanceFromCenter <= earthVisualRadius) {
      collisionDetected = true;
      collisionVelocity = state.velocity.length();

      // حساب طاقة التصادم (KE = ½mv²)
      const collisionEnergy = 0.5 * config.satelliteMass * collisionVelocity * collisionVelocity;

      // تحديد حجم الانفجار بناءً على طاقة التصادم
      const explosionSize = Math.min(Math.max(collisionEnergy / 1e6, 0.1), 2.0);
      const particleCount = Math.min(Math.max(collisionEnergy / 1e4, 100), 500);


      createExplosion(scaledPosition, {
        particleCount: particleCount,
        color: 0xff4444,
        size: explosionSize,
        durationMs: 3000
      });

      // إزالة القمر الصناعي بعد تأخير قصير
      setTimeout(() => {
        removeSatellite();
        // إعادة تعيين تلقائية بعد الانفجار
        setTimeout(() => {
          params.resetOrbit();
        }, 2000);
      }, 1000);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
