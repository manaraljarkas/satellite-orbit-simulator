
// ——— مرجع (اختياري): تأثير انفجار باستخدام نقاط ———
import * as THREE from "three";
import { scene } from "./scene.js";
export function createExplosion(position, { particleCount = 200, color = 0xffaa33, size = 0.2, durationMs = 1500 } = {}) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 0] = position.x;
        positions[i3 + 1] = position.y;
        positions[i3 + 2] = position.z;
        const dir = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
        const speed = 2 + Math.random() * 4;
        velocities[i3 + 0] = dir.x * speed;
        velocities[i3 + 1] = dir.y * speed;
        velocities[i3 + 2] = dir.z * speed;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    const start = performance.now();
    function update() {
        const now = performance.now();
        const elapsed = now - start;
        const t = Math.min(1, elapsed / durationMs);
        const dt = 0.016;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3 + 0] += velocities[i3 + 0] * dt;
            positions[i3 + 1] += velocities[i3 + 1] * dt;
            positions[i3 + 2] += velocities[i3 + 2] * dt;
        }
        geometry.attributes.position.needsUpdate = true;
        material.opacity = 1 - t;
        if (elapsed < durationMs) requestAnimationFrame(update);
        else { scene.remove(points); geometry.dispose(); material.dispose(); }
    }
    requestAnimationFrame(update);
    return points;
}





