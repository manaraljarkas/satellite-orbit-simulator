// ——— ملف موحد للبارامترات والتكوين ———

// استيراد الدوال المطلوبة
import { G, EARTH_MASS, R_EARTH } from "./constants.js";
import { state } from "./state.js";
import { recreateSatellite } from "../environment/satellite.js";
import { resetCollision } from "../animate.js";

// ——— إعدادات المحاكاة ———
export const config = {
  satelliteMass: 500,         // kg
  initialAltitude: 200e3,     // m ← 200 كم فوق سطح الأرض
  enableGravity: true,
  dt: 1,
  userDragEnabled: false,
  userAirDensity: 0.001,      // kg/m³ - قيمة منخفضة واقعية
};

// ——— بارامترات واجهة المستخدم ———
export const params = {
  mass: 500,
  altitudeKm: 200,
  velocityFactor: 1.0,        // معامل السرعة: 1.0 = مدار دائري، < 1.0 = مدار إهليلجي بطيء، > 1.0 = مدار إهليلجي سريع
  dt: 1,
  gravityEnabled: true,
  userDragEnabled: false,
  userAirDensity: 0.001, // قيمة منخفضة لتبدأ بها

  // دالة إعادة تعيين المدار
  resetOrbit: () => {
    console.log('🔄 بدء إعادة تعيين المدار...');
    console.log('القيم الحالية:', {
      mass: params.mass,
      altitudeKm: params.altitudeKm,
      velocityFactor: params.velocityFactor,
      dt: params.dt,
      gravityEnabled: params.gravityEnabled,
      userDragEnabled: params.userDragEnabled,
      userAirDensity: params.userAirDensity
    });

    // تحديث إعدادات المحاكاة
    config.satelliteMass = params.mass;
    config.initialAltitude = params.altitudeKm * 1000;
    config.dt = params.dt;
    config.enableGravity = params.gravityEnabled;
    config.userDragEnabled = params.userDragEnabled;
    config.userAirDensity = params.userAirDensity;

    console.log('✅ تم تحديث config:', config);

    // إعادة تعيين المدار
    resetSatelliteOrbit();

    // إعادة تعيين حالة التصادم
    resetCollision();

    // إعادة إنشاء القمر الصناعي إذا لم يكن موجوداً
    recreateSatellite();

    console.log('✅ تم إعادة تعيين المدار بنجاح!');
  },
};

// دالة إعادة تعيين مدار القمر الصناعي
export function resetSatelliteOrbit() {
  // إعادة حساب الموقع
  const r = R_EARTH + config.initialAltitude;
  state.position.set(r, 0, 0);

  // إعادة حساب السرعة المدارية مع تطبيق معامل السرعة
  let v = 0;
  if (r > R_EARTH) {
    const circularVelocity = Math.sqrt(G * EARTH_MASS / r);
    v = circularVelocity * params.velocityFactor;
  }
  state.velocity.set(0, 0, v);

  console.log('تم إعادة تعيين المدار:', {
    position: state.position,
    velocity: state.velocity,
    altitude: (r - R_EARTH) / 1000 + ' كم',
    velocityFactor: params.velocityFactor,
    orbitType: getOrbitType(params.velocityFactor)
  });
}

// دالة لتحديد نوع المدار
function getOrbitType(velocityFactor) {
  if (velocityFactor === 1.0) {
    return 'مدار دائري';
  } else if (velocityFactor < 1.0) {
    return 'مدار إهليلجي (بطيء)';
  } else if (velocityFactor > 1.0) {
    return 'مدار إهليلجي (سريع)';
  }
  return 'غير محدد';
}



