import * as THREE from "three";
import { 
  G, EARTH_MASS, R_EARTH,
  satelliteArea, dragCoefficient,
  densityAtAltitude
} from "./constants.js";
import { config } from "./config.js";

// الجاذبية
export function gravitationalForce(position, m) {
  const r = position.length();
  const direction = position.clone().normalize().negate();
  const magnitude = (G * EARTH_MASS * m) / (r * r);
  return direction.multiplyScalar(magnitude);
}

// السحب الجوي
function dragForce(position, velocity) {
  const altitude = position.length() - R_EARTH;
  const rho = densityAtAltitude(altitude);
  const v = velocity.length();
  if (v === 0 || rho <= 0) return new THREE.Vector3(0,0,0);

  const direction = velocity.clone().normalize().negate();
  const magnitude = 0.5 * rho * v * v * satelliteArea * dragCoefficient;
  return direction.multiplyScalar(magnitude);
}

// محصلة القوى
export function computeTotalForce(position, velocity) {
  const Fnet = new THREE.Vector3();
  const totalMass = config.satelliteMass;

  if (config.enableGravity) {
    const Fg = gravitationalForce(position, totalMass);
    Fnet.add(Fg);
  }

  const Fd = dragForce(position, velocity);
  Fnet.add(Fd);

  // لا thrustForce ولا centrifugalForce
  return Fnet;
}
