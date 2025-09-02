import * as THREE from "three";
import { scene } from "../environment/scene.js";
import { G, EARTH_MASS, R_EARTH, SCALE } from "../physics/constants.js";
import { config, params } from "../physics/config.js";

let orbitLine = null;

export function drawInitialOrbit() {
  if (orbitLine) {
    scene.remove(orbitLine);
    orbitLine.geometry.dispose();
    orbitLine.material.dispose();
  }

  const r = R_EARTH + config.initialAltitude;
  const circularVelocity = Math.sqrt(G * EARTH_MASS / r) * params.velocityFactor;

  // عدد النقاط لرسم المدار
  const points = [];
  const steps = 360; // دقة المدار

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
  
    // دوران حول محور x–z
    const x = r * Math.cos(angle);
    const y = 0;
    const z = r * Math.sin(angle);
  
    points.push(new THREE.Vector3(x, y, z).multiplyScalar(SCALE));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });
  orbitLine = new THREE.LineLoop(geometry, material);

  scene.add(orbitLine);
}
