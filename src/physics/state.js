import * as THREE from "three";
import { G, EARTH_MASS, R_EARTH } from "./constants.js";
import { config, params } from "./config.js";

// تهيئة القيم الأولية
const initialAltitude = 200e3; // 200 كم
const initialMass = 500; // 500 kg

let r = R_EARTH + initialAltitude;
let v = 0;

if (initialAltitude > 0) {
  v = Math.sqrt(G * EARTH_MASS / r);
}

export const state = {
  position: new THREE.Vector3(r, 0, 0),
  velocity: new THREE.Vector3(0, 0, v),
};

// دالة لإعادة تعيين حالة التصادم
export function resetCollisionState() {
  // هذه الدالة ستُستدعى من animate.js لإعادة تعيين متغيرات التصادم
  return {
    collisionDetected: false,
    collisionVelocity: 0
  };
}



