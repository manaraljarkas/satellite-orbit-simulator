import * as THREE from "three";
import { G, EARTH_MASS, R_EARTH } from "./constants.js";
import { config } from "./config.js";

// تهيئة القيم الأولية
const initialAltitude = 200e3; // 200 كم
const initialMass = 500; // 500 kg
const initialFuelMass = 10; // 10 kg

let r = R_EARTH + initialAltitude;
let v = 0;

if (initialAltitude > 0) {
  v = Math.sqrt(G * EARTH_MASS / r);
}

export const state = {
  position: new THREE.Vector3(r, 0, 0),
  velocity: new THREE.Vector3(0, 0, v),
  fuelMass: initialFuelMass,
};

// دالة إعادة تعيين مدار القمر الصناعي
export function resetSatelliteOrbit() {
  // إعادة حساب الموقع
  const r = R_EARTH + config.initialAltitude;
  state.position.set(r, 0, 0);

  // إعادة حساب السرعة المدارية
  let v = 0;
  if (r > R_EARTH) {
    v = Math.sqrt(G * EARTH_MASS / r);
  }
  state.velocity.set(0, 0, v);

  // إعادة تعيين كتلة الوقود
  state.fuelMass = config.fuelMass;

  console.log('تم إعادة تعيين المدار:', {
    position: state.position,
    velocity: state.velocity,
    altitude: (r - R_EARTH) / 1000 + ' كم'
  });
}



