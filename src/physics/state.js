import * as THREE from "three";
import { G, EARTH_MASS, R_EARTH } from "./constants.js";



const initialAltitude = 200e3;


let r = R_EARTH + initialAltitude;
let v = 0;

if (initialAltitude > 0) {
  v = Math.sqrt(G * EARTH_MASS / r);
}

export const state = {
  position: new THREE.Vector3(r, 0, 0),
  velocity: new THREE.Vector3(0, 0, v),
};


export function resetCollisionState() {
  return {
    collisionDetected: false,
    collisionVelocity: 0
  };
}



