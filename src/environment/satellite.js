import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene } from "./scene.js";
import { state } from "../physics/state.js";
import { SCALE } from "../physics/constants.js";

export let satellite = null;


function createSatellite() {
  const loader = new GLTFLoader();
  loader.load("/models/satellite.glb", (gltf) => {
    const initialScaledPosition = state.position.clone().multiplyScalar(SCALE);
    satellite = gltf.scene;
    satellite.scale.set(0.5, 0.5, 0.5);
    satellite.position.copy(initialScaledPosition);
    scene.add(satellite);
    console.log('🛰️ تم إنشاء القمر الصناعي بنجاح');
  });
}

createSatellite();

export function removeSatellite() {
  if (!satellite) return;

  scene.remove(satellite);

  satellite.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose && m.dispose());
      } else if (child.material.dispose) {
        child.material.dispose();
      }
    }
  });

  satellite = null;
}

export function recreateSatellite() {
  if (satellite) {
    console.log('🛰️ القمر الصناعي موجود بالفعل');
    return;
  }

  console.log('🛰️ إعادة إنشاء القمر الصناعي...');
  createSatellite();
}
