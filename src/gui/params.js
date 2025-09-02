// استيراد config لتحديثه
import { config } from "../physics/config.js";
import { resetSatelliteOrbit } from "../physics/state.js";
import { recreateSatellite } from "../environment/satellite.js";

// ——— بارامترات واجهة المستخدم ———
export const params = {
  mass: 500,
  altitudeKm: 200,
  velocityFactor: 1.0,
  fuelMass: 10,
  dt: 1,
  gravityEnabled: true,
  userDragEnabled: false,
  userAirDensity: 0.001, // قيمة منخفضة لتبدأ بها
  testTorque: 0.0,
  enableRotation: false,
  torqueX: 0,
  torqueY: 0,
  torqueZ: 0,
  maxAngularSpeed: 4,
  warningAngularSpeed: 3,

  // دالة إعادة تعيين المدار
  resetOrbit: () => {
    console.log("🔄 بدء إعادة تعيين المدار...");
    console.log("القيم الحالية:", {
      mass: params.mass,
      altitudeKm: params.altitudeKm,
      dt: params.dt,
      gravityEnabled: params.gravityEnabled,
      userDragEnabled: params.userDragEnabled,
      userAirDensity: params.userAirDensity,
      fuelMass: params.fuelMass,
    });

    // تحديث إعدادات المحاكاة
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

    console.log("✅ تم تحديث config:", config);

    // إعادة تعيين المدار
    resetSatelliteOrbit();

    // إعادة إنشاء القمر الصناعي إذا لم يكن موجوداً
    recreateSatellite();

    console.log("✅ تم إعادة تعيين المدار بنجاح!");
  },
};
