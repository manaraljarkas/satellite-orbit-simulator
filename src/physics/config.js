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
  fuelMass: 10,
  testTorque: 0.0,
  enableRotation: false,
  torqueX: 0,
  torqueY: 0,
  torqueZ: 0,
  maxAngularSpeed: 4,       // rad/s
  warningAngularSpeed: 3,   // rad/s
  enableDragTorque: false,
  enableThruster: false,
  dampingEnabled: false,
  thrustForce: 0,
};


export const params = {
  mass: 500,
  altitudeKm: 200,
  velocityFactor: 1.0,
  dt: 1,
  gravityEnabled: true,
  userDragEnabled: false,
  userAirDensity: 0.001,
  fuelMass: 10,
  testTorque: 0.0,
  enableRotation: false,
  torqueX: 0,
  torqueY: 0,
  torqueZ: 0,
  maxAngularSpeed: 4,
  warningAngularSpeed: 3,


  resetOrbit: () => {
    config.satelliteMass = params.mass;
    config.initialAltitude = params.altitudeKm * 1000;
    config.dt = params.dt;
    config.enableGravity = params.gravityEnabled;
    config.userDragEnabled = params.userDragEnabled;
    config.userAirDensity = params.userAirDensity;
    config.fuelMass = params.fuelMass;
    config.testTorque = params.testTorque;
    config.enableRotation = params.enableRotation;
    config.torqueX = params.torqueX;
    config.torqueY = params.torqueY;
    config.torqueZ = params.torqueZ;
    config.maxAngularSpeed = params.maxAngularSpeed;
    config.warningAngularSpeed = params.warningAngularSpeed;
    resetSatelliteOrbit();
    resetCollision();
    recreateSatellite();
    drawInitialOrbit();
  },

  // دالة إعادة تعيين جميع القيم إلى الافتراضية
  resetToDefaults: () => {
    // إعادة تعيين جميع القيم إلى الافتراضية
    params.mass = 500;
    params.altitudeKm = 200;
    params.velocityFactor = 1.0;
    params.dt = 1;
    params.gravityEnabled = true;
    params.userDragEnabled = false;
    params.userAirDensity = 0.001;
    params.fuelMass = 10;
    params.testTorque = 0.0;
    params.enableRotation = false;
    params.torqueX = 0;
    params.torqueY = 0;
    params.torqueZ = 0;
    params.maxAngularSpeed = 4;
    params.warningAngularSpeed = 3;

    // تحديث config
    config.satelliteMass = params.mass;
    config.initialAltitude = params.altitudeKm * 1000;
    config.dt = params.dt;
    config.enableGravity = params.gravityEnabled;
    config.userDragEnabled = params.userDragEnabled;
    config.userAirDensity = params.userAirDensity;
    config.fuelMass = params.fuelMass;
    config.testTorque = params.testTorque;
    config.enableRotation = params.enableRotation;
    config.torqueX = params.torqueX;
    config.torqueY = params.torqueY;
    config.torqueZ = params.torqueZ;
    config.maxAngularSpeed = params.maxAngularSpeed;
    config.warningAngularSpeed = params.warningAngularSpeed;

    // إعادة تعيين المدار
    resetSatelliteOrbit();
    resetCollision();
    recreateSatellite();
    drawInitialOrbit();

    // تحديث واجهة المستخدم
    setTimeout(() => {
      // إعادة تحميل الصفحة لتحديث واجهة المستخدم
      window.location.reload();
    }, 500);
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





