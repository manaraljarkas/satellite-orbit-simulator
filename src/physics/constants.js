// === ثوابت فيزيائية ===
export const G = 6.67430e-11;       // ثابت الجذب العام [N·m²/kg²]
export const EARTH_MASS = 5.972e24; // كتلة الأرض [kg]
export const R_EARTH = 6.371e6;     // نصف قطر الأرض بالمتر

// === خصائص القمر الصناعي ===
export const satelliteArea = 2;     // m² ← مقطع القمر الصناعي
export const dragCoefficient = 2.2; // Cd معامل السحب

// === نموذج الغلاف الجوي ===
export const SEA_LEVEL_DENSITY = 1.225; // kg/m³ عند سطح البحر
export const SCALE_HEIGHT = 8500;       // m مقياس الارتفاع

// دالة الكثافة الجوية (واقعية فقط)
export function densityAtAltitude(altitudeMeters) {
  const h = Math.max(0, altitudeMeters);
  return SEA_LEVEL_DENSITY * Math.exp(-h / SCALE_HEIGHT);
}

// === ثوابت الرسم (ثلاثي الأبعاد) ===
export const SCALE = 1 / 1e6;                 // كل 1 مليون متر = 1 وحدة مشهدية
export const EARTH_RADIUS = R_EARTH * SCALE;  // نصف قطر الأرض في المشهد
