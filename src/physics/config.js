export const config = {
  satelliteMass: 500,         // kg
  initialAltitude: 200e3,     // m ← 200 كم فوق سطح الأرض
  enableGravity: true,
  dt: 1,
  fuelMass: 10,
  userDragEnabled: false,
  userAirDensity: 0.001,      // kg/m³ - قيمة منخفضة واقعية

// دوران
  enableRotation: false,
  torqueX: 0,
  torqueY: 0,
  torqueZ: 0,
  maxAngularSpeed: 4,        // rad/s
  warningAngularSpeed: 3,    // rad/s

  // خيارات إضافية إن احتجتها
  enableDragTorque: false,
  enableThruster: false,
  dampingEnabled: false,
  thrustForce: 0,
};