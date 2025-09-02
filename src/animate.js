console.log("✅ animate.js is loaded");

import * as THREE from "three";
import { computeTotalForce } from "./physics/forces.js";
import { state, resetCollisionState } from "./physics/state.js";
import { camera } from "./environment/scene.js";
import { earth } from "./environment/earth.js";
import { satellite } from "./environment/satellite.js";
import { renderer, scene } from "./environment/scene.js";
import { controls } from "./environment/controls.js";
import { SCALE, EARTH_RADIUS } from "./physics/constants.js";
import { config, params } from "./physics/config.js";
import { createExplosion } from "./environment/explosion.js";
import { removeSatellite } from "./environment/satellite.js";
import { drawInitialOrbit } from "./environment/orbitPath.js";
let collisionDetected = false;
let collisionVelocity = 0;
// let trajectoryPoints = [];
// let trajectoryLine = null;


export function resetCollision() {
  collisionDetected = false;
  collisionVelocity = 0;
}
// const trajectoryPoints = [];
// const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
// const trajectoryMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 });
// const trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
// scene.add(trajectoryLine);

export function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;

  const Fnet = computeTotalForce(state.position, state.velocity);

  // تسارع - قانون نيوتن الثاني: a = F/m
  const acceleration = Fnet.clone().divideScalar(config.satelliteMass);

  // تحديث السرعة
  state.velocity.add(acceleration.clone().multiplyScalar(config.dt));

  // تحديث الموقع
  state.position.add(state.velocity.clone().multiplyScalar(config.dt));

  if (satellite && !collisionDetected) {
    const scaledPosition = state.position.clone().multiplyScalar(SCALE);
    satellite.position.copy(scaledPosition);
    satellite.lookAt(new THREE.Vector3(0, 0, 0));
    // trajectoryPoints.push(scaledPosition.clone());

    // // تحديد أقصى طول للمسار (مثلاً 2000 نقطة)
    // if (trajectoryPoints.length > 2000) {
    //   trajectoryPoints.shift();
    // }
    
    // // لو في خط قديم احذفه
    // if (trajectoryLine) {
    //   scene.remove(trajectoryLine);
    //   trajectoryLine.geometry.dispose(); // تخلّص من الذاكرة
    //   trajectoryLine.material.dispose();
    // }
    
    // // إنشاء خط جديد من النقاط الحالية
    // const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
    // const trajectoryMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    // trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
    // scene.add(trajectoryLine);

    // drawInitialOrbit();

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
      }, 1000);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
