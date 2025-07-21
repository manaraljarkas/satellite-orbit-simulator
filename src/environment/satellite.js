import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene } from "./scene.js";

export let satellite = null;

const loader = new GLTFLoader();
loader.load("/models/satellite.glb", (gltf) => {
  satellite = gltf.scene;
  satellite.scale.set(0.5, 0.5, 0.5);
  satellite.position.set(8, 0, 0);
  scene.add(satellite);
});
