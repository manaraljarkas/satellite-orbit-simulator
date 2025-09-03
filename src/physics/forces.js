import * as THREE from "three";
import {
  G, EARTH_MASS, R_EARTH,
  satelliteArea, dragCoefficient,
  densityAtAltitude
} from "./constants.js";
import { config } from "./config.js";

export function gravitationalForce(position, m) {
  const r = position.length();
  const direction = position.clone().normalize().negate();
  const magnitude = (G * EARTH_MASS * m) / (r * r);
  return direction.multiplyScalar(magnitude);
}

function dragForce(position, velocity) {

  if (!config.userDragEnabled) {
    return new THREE.Vector3(0, 0, 0);
  }

  const altitude = position.length() - R_EARTH;

    if (altitude > 500000) { 
    return new THREE.Vector3(0, 0, 0);
  }


  const v = velocity.length();


  const direction = velocity.clone().normalize().negate();

  // معادلة قوة السحب الأساسية: F = ½ × ρ × v² × Cd × A
  let magnitude = 0.5 *  v * v * satelliteArea * dragCoefficient;

  // تحديد حد أقصى لقوة السحب لمنع اختفاء القمر فوراً
  const maxDragForce = config.satelliteMass * 2; // قوة أقصى للسحب
  magnitude = Math.min(magnitude, maxDragForce);

  return direction.multiplyScalar(magnitude);
}



export function computeTotalForce(position, velocity) {
  const Fnet = new THREE.Vector3();
  const totalMass = config.satelliteMass;

  if (config.enableGravity) {
    const Fg = gravitationalForce(position, totalMass);
    Fnet.add(Fg);
  }

  const Fd = dragForce(position, velocity);
  Fnet.add(Fd);

  return Fnet;
}