import * as THREE from "three";
import { G, EARTH_MASS, R_EARTH } from "./constants.js";
import { config } from "./config.js";

let r = R_EARTH + config.initialAltitude;
let v = 0; 

if (config.initialAltitude > 0) {
  v = Math.sqrt(G * EARTH_MASS / r);
}

export const state = {
  position: new THREE.Vector3(r, 0, 0),
  velocity: new THREE.Vector3(0, 0, v),
  fuelMass: config.fuelMass,
};



