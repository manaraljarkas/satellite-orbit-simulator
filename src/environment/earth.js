import * as THREE from "three";
import { scene } from "./scene.js";

const textureLoader = new THREE.TextureLoader();
const albedoMap = textureLoader.load("/textures/earth_albedo.jpg");
const nightMap = textureLoader.load("/textures/BlackMarble_2016_01deg.jpg");

const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: albedoMap,
  emissiveMap: nightMap,
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 0.7,
});

export const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);
