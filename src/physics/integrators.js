import { attitude } from "./attitude.js";
import * as THREE from "three";

function normalize(q) {
  const n = Math.hypot(...q);
  return q.map(v => v / n);
}

export function updateAttitude(dt, torque, config) {
  let [q0, q1, q2, q3] = attitude.q;
  let [wx, wy, wz] = attitude.omega;
  const [Ix, Iy, Iz] = attitude.I;

  // I * domega = tau - (omega × (I*omega))
  const tau = torque; // THREE.Vector3
  const omegaVec = new THREE.Vector3(wx, wy, wz);
  const Iomega = new THREE.Vector3(Ix*wx, Iy*wy, Iz*wz);
  const crossTerm = new THREE.Vector3(
    omegaVec.y * Iomega.z - omegaVec.z * Iomega.y,
    omegaVec.z * Iomega.x - omegaVec.x * Iomega.z,
    omegaVec.x * Iomega.y - omegaVec.y * Iomega.x
  );

  const domega = new THREE.Vector3(
    (tau.x - crossTerm.x) / Ix,
    (tau.y - crossTerm.y) / Iy,
    (tau.z - crossTerm.z) / Iz
  );

  // تحديث omega
  wx += domega.x * dt;
  wy += domega.y * dt;
  wz += domega.z * dt;

  // 🌀 التخميد (فقط لو مفعّل)
  if (config.dampingEnabled) {
    const dampingFactor = 0.95; // كل إطار يخفف السرعة 5%
    wx *= dampingFactor;
    wy *= dampingFactor;
    wz *= dampingFactor;
  }

  // تحديث الكواترنيون
  const dq0 = 0.5 * (-q1*wx - q2*wy - q3*wz);
  const dq1 = 0.5 * ( q0*wx + q2*wz - q3*wy);
  const dq2 = 0.5 * ( q0*wy - q1*wz + q3*wx);
  const dq3 = 0.5 * ( q0*wz + q1*wy - q2*wx);

  q0 += dq0 * dt;
  q1 += dq1 * dt;
  q2 += dq2 * dt;
  q3 += dq3 * dt;

  attitude.q = normalize([q0,q1,q2,q3]);
  attitude.omega = [wx, wy, wz];
}

// 🔄 إعادة ضبط الدوران
export function resetRotation() {
  attitude.q = [1, 0, 0, 0]; // هوية الكواترنيون
  attitude.omega = [0, 0, 0]; // تصفير السرعة الزاوية
}
