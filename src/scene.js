import * as THREE from "three";

// Create Scene
export const scene = new THREE.Scene();

// Camera
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 20);

// Renderer
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
export const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

export const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.position.set(10, 10, 10);
scene.add(sunLight);

// Skybox
const loader = new THREE.CubeTextureLoader();
scene.background = loader.load([
  "/skybox/positive-x-right.png",
  "/skybox/negative-x-left.png",
  "/skybox/positive-y-top.png",
  "/skybox/negative-y-bottom.png",
  "/skybox/positive-z-front.png",
  "/skybox/negative-z-back.png",
]);
