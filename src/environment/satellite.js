import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene } from "./scene.js";
import { state } from "../physics/state.js"; // ← حسب مسار ملفك
import { SCALE } from "../physics/constants.js"; //
export let satellite = null;


const loader = new GLTFLoader();
loader.load("/models/satellite.glb", (gltf) => {
  const initialScaledPosition = state.position.clone().multiplyScalar(SCALE);
  satellite = gltf.scene;
  satellite.scale.set(0.5, 0.5, 0.5);

  satellite.position.copy(initialScaledPosition);

  scene.add(satellite);
});
