console.log("✅ animate.js is loaded");

import * as THREE from "three";
import { computeTotalForce } from "./physics/forces.js";
import { state, resetCollisionState } from "./physics/state.js";
import { camera } from "./environment/scene.js";
import { earth } from "./environment/earth.js";
import { satellite } from "./environment/satellite.js";
import { renderer, scene } from "./environment/scene.js";
import { controls } from "./environment/controls.js";
import { SCALE, EARTH_RADIUS } from "./physics/constants.js";
import { config, params } from "./physics/config.js";
import { createExplosion } from "./environment/explosion.js";
import { removeSatellite } from "./environment/satellite.js";

// متغيرات للتصادم
let collisionDetected = false;
let collisionVelocity = 0;

// دالة لإعادة تعيين حالة التصادم
export function resetCollision() {
  collisionDetected = false;
  collisionVelocity = 0;
}

export function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.001;

  // محصلة القوى
  const Fnet = computeTotalForce(
    state.position,
    state.velocity
  );

  // تسارع - قانون نيوتن الثاني: a = F/m
  const acceleration = Fnet.clone().divideScalar(config.satelliteMass);

  // تحديث السرعة
  state.velocity.add(acceleration.clone().multiplyScalar(config.dt));

  // تحديث الموقع
  state.position.add(state.velocity.clone().multiplyScalar(config.dt));

  // تحديث الرسم مع فحص التصادم المحسن
  if (satellite && !collisionDetected) {
    const scaledPosition = state.position.clone().multiplyScalar(SCALE);
    satellite.position.copy(scaledPosition);
    satellite.lookAt(new THREE.Vector3(0, 0, 0));

    // فحص التصادم مع الأرض - تحسين دقة التصادم
    const distanceFromCenter = scaledPosition.length();
    const earthVisualRadius = EARTH_RADIUS * 0.6; // نفس scale المستخدم في earth.js

    if (distanceFromCenter <= earthVisualRadius) {
      collisionDetected = true;
      collisionVelocity = state.velocity.length();

      console.log('💥 تصادم! القمر الصناعي اصطدم بالأرض');
      console.log('سرعة التصادم:', (collisionVelocity / 1000).toFixed(2), 'كم/ث');
      console.log('كتلة القمر الصناعي:', config.satelliteMass, 'كجم');
      console.log('معامل السرعة المستخدم:', params.velocityFactor);

      // حساب طاقة التصادم (KE = ½mv²)
      const collisionEnergy = 0.5 * config.satelliteMass * collisionVelocity * collisionVelocity;
      console.log('طاقة التصادم:', (collisionEnergy / 1e6).toFixed(2), 'ميجا جول');

      // مقارنة مع طاقة TNT (1 كجم TNT = 4.184 ميجا جول)
      const tntEquivalent = collisionEnergy / (4.184e6);
      console.log('مكافئ TNT:', tntEquivalent.toFixed(2), 'كجم TNT');

      // تحليل تأثير الكتلة
      console.log('📊 تحليل تأثير الكتلة:');
      console.log('  - كتلة أكبر = طاقة تصادم أعلى');
      console.log('  - كتلة أكبر = تأثير أبطأ من مقاومة الهواء');
      console.log('  - كتلة أصغر = تأثير أسرع من مقاومة الهواء');

      // تحليل تأثير معامل السرعة
      console.log('📊 تحليل تأثير معامل السرعة:');
      console.log('  - معامل 1.0 = مدار دائري');
      console.log('  - معامل < 1.0 = مدار إهليلجي (بطيء)');
      console.log('  - معامل > 1.0 = مدار إهليلجي (سريع)');

      // تحديد حجم الانفجار بناءً على طاقة التصادم
      const explosionSize = Math.min(Math.max(collisionEnergy / 1e6, 0.1), 2.0);
      const particleCount = Math.min(Math.max(collisionEnergy / 1e4, 100), 500);

      // إنشاء انفجار في موقع التصادم
      createExplosion(scaledPosition, {
        particleCount: particleCount,
        color: 0xff4444,
        size: explosionSize,
        durationMs: 3000
      });

      // إزالة القمر الصناعي بعد تأخير قصير
      setTimeout(() => {
        removeSatellite();
      }, 1000);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
