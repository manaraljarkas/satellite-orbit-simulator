import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { camera, renderer } from "./scene.js";

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
