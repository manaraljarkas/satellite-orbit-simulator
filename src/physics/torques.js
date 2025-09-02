import * as THREE from "three";
import { computeTotalForce } from "./forces.js";

function cross(a, b) {
  return new THREE.Vector3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

export function computeTorques(state, config) {
  const total = new THREE.Vector3();

  // 🧪 عزوم تجريبية من الـ GUI
  if (typeof config.torqueX === "number" ||
      typeof config.torqueY === "number" ||
      typeof config.torqueZ === "number") {
    total.add(new THREE.Vector3(
      config.torqueX || 0,
      config.torqueY || 0,
      config.torqueZ || 0
    ));
  }

  if (config.enableDragTorque) {
    const dragOffset = new THREE.Vector3(0, 0.5, 0);
    const Fdrag = computeTotalForce(state.position, state.velocity);
    total.add(cross(dragOffset, Fdrag));
  }

  if (config.enableThruster) {
    const r = new THREE.Vector3(1, 0, 0);
    const F = new THREE.Vector3(0, config.thrustForce || 0, 0);
    total.add(cross(r, F));
  }

  return total;
}
