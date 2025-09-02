import { G, EARTH_MASS, R_EARTH } from "./constants.js";
import { state } from "./state.js";
import { recreateSatellite } from "../environment/satellite.js";
import { resetCollision } from "../animate.js";
import { drawInitialOrbit } from "../environment/orbitPath.js";

export const config = {
  satelliteMass: 500,         
  initialAltitude: 200e3,    
  enableGravity: true,
  dt: 1,
  userDragEnabled: false,
  userAirDensity: 0.001,      
};


export const params = {
  mass: 500,
  altitudeKm: 200,
  velocityFactor: 1.0,        
  dt: 1,
  gravityEnabled: true,
  userDragEnabled: false,
  userAirDensity: 0.001, 

  
  resetOrbit: () => {
    config.satelliteMass = params.mass;
    config.initialAltitude = params.altitudeKm * 1000;
    config.dt = params.dt;
    config.enableGravity = params.gravityEnabled;
    config.userDragEnabled = params.userDragEnabled;
    config.userAirDensity = params.userAirDensity;
    resetSatelliteOrbit();
    resetCollision();
    recreateSatellite();
    drawInitialOrbit();
  },
};

export function resetSatelliteOrbit() {
  const r = R_EARTH + config.initialAltitude;
  state.position.set(r, 0, 0);

  let v = 0;
  if (r > R_EARTH) {
    const circularVelocity = Math.sqrt(G * EARTH_MASS / r);
    v = circularVelocity * params.velocityFactor;
  }
  state.velocity.set(0, 0, v);

  
}





