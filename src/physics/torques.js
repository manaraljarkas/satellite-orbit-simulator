// torques.js
import * as THREE from "three";
import { computeTotalForce } from "./forces.js";

// دالة الضرب المتجهي
function cross(a, b) {
  return new THREE.Vector3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

//حساب العزوم
export function computeTorques(state, config) {
  let totalTorque = new THREE.Vector3();

  // 1) مثال: عزم السحب الجوي (لو اعتبرنا نقطة التأثير بعيدة شوي عن COM)
  if (config.enableDragTorque) {
    const dragOffset = new THREE.Vector3(0, 0.5, 0); // متر، وهمي
    const Fdrag = computeTotalForce(state.position, state.velocity); // السحب جزء منه
    totalTorque.add(cross(dragOffset, Fdrag));
  }

  // 2) مثال: محرك تصحيحي Thruster
  if (config.enableThruster) {
    const r = new THREE.Vector3(1, 0, 0); // موقع thruster بالنسبة للـ COM
    const F = new THREE.Vector3(0, config.thrustForce, 0); // قوة الدفع
    totalTorque.add(cross(r, F));
  }

  return totalTorque;
}

// export function computeTorques(state, config) {
//   // تجربة: عزم ثابت حول المحور Y
//   return new THREE.Vector3(0, 1e-2, 0);
// }