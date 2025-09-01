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

// السحب الجوي - باستخدام معادلة قوة السحب الأساسية مع تكبير بسيط
function dragForce(position, velocity) {
  // التحقق من تفعيل مقاومة الهواء
  if (!config.userDragEnabled) {
    return new THREE.Vector3(0, 0, 0);
  }

  const altitude = position.length() - R_EARTH;
  // استخدام كثافة الهواء المخصصة من المستخدم أو النموذج الفيزيائي
  let rho = config.userAirDensity || densityAtAltitude(altitude);

  // تكبير أقل لجعل التأثير أكثر توازناً
  rho = rho * 10; // تكبير 10 مرات فقط (بدلاً من 50)

  const v = velocity.length();
  if (v === 0 || rho <= 0) return new THREE.Vector3(0, 0, 0);

  const direction = velocity.clone().normalize().negate();

  // معادلة قوة السحب الأساسية: F = ½ × ρ × v² × Cd × A
  let magnitude = 0.5 * rho * v * v * satelliteArea * dragCoefficient;

  // تحديد حد أقصى لقوة السحب لمنع اختفاء القمر فوراً
  const maxDragForce = config.satelliteMass * 2; // قوة أقصى للسحب
  magnitude = Math.min(magnitude, maxDragForce);

  return direction.multiplyScalar(magnitude);
}

// محصلة القوى
export function computeTotalForce(position, velocity) {
  const Fnet = new THREE.Vector3();
  const totalMass = config.satelliteMass;

  // تطبيق الجاذبية إذا كانت مفعلة
  if (config.enableGravity) {
    const Fg = gravitationalForce(position, totalMass);
    Fnet.add(Fg);
  }

  // تطبيق مقاومة الهواء
  const Fd = dragForce(position, velocity);
  Fnet.add(Fd);

  return Fnet;
}
