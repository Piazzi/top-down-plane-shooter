import * as THREE from "three";
import {
  initCamera,
  createGroundPlaneWired,
  onWindowResize,
  createLightSphere,
} from "../../libs/util/util.js";

import { healthpacks, spawnHealthpack } from "./healthpack.js";
import { keyboardUpdate, player, projectiles } from "./player.js";
import { spawnEnemy, enemies, projectileEnemies  } from "./enemy.js";
import { dirLight, ambientLight, lightPosition } from "./lighting.js";
import { stats, resetHearts, clock, resetGameMessage } from "./interface.js";
import { HEIGHT, SPAWN_HEALTHPACK_INTERVAL, SPAWN_TYPE_1_ENEMY_INTERVAL, SPAWN_TYPE_2_ENEMY_INTERVAL, SPAWN_TYPE_3_ENEMY_INTERVAL, SPAWN_TYPE_4_ENEMY_INTERVAL, PLANE_SPEED } from "./config.js";

export var scene = new THREE.Scene(); // Create main scene

// Set all renderers
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0xf2e394, 0.5); // second param is opacity, 0 => transparent

document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // default

var camera = initCamera(new THREE.Vector3(0, 45, -30)); // Init camera in this position
createLightSphere(scene, 0.5, 10, 10, lightPosition);

// create the ground plane
let plane = createGroundPlaneWired(125, 200, 1, 1, "#F2E394");
plane.position.set(0, 0, 0);
plane.receiveShadow = true;

let plane2 = createGroundPlaneWired(125, 200, 1, 1, "#F2E394");
plane2.position.set(0, 0, 200);
plane2.receiveShadow = true;

var textureLoader = new THREE.TextureLoader();
var paper = textureLoader.load("./images/paper.jpg");

// Add texture to the 'map' property of the object's material
plane.material.map = paper;
plane2.material.map = paper;

// adds the player to the scene
scene.add(dirLight);
scene.add(ambientLight);
//scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

render();

// move the plane against the player to simulate movement
function movePlane() {
  scene.add(plane);
  scene.add(plane2);
  plane.translateY(PLANE_SPEED);
  plane2.translateY(PLANE_SPEED);

  if (plane2.position.z < 0 && plane2.position.z > -0.1) {
    plane.position.z = 200;
  } else if (plane.position.z < 0 && plane.position.z > -0.1) {
    plane2.position.z = 200;
  }
}

// resets the game removing all active
// enemies, projectiles and setting the players position

export function resetGame() {
  enemies.forEach((e) => {
    scene.remove(e);
  });

  healthpacks.forEach((e) => {
    scene.remove(e);
  });

  projectileEnemies.forEach((e) => {
    scene.remove(e);
  });

  projectiles.length = 0;
  enemies.length = 0;
  player.position.set(0.0, HEIGHT, 0.0);

  resetHearts();
  clock.start();
  resetGameMessage.style.visibility = "visible";
  setTimeout(() => {
    resetGameMessage.style.visibility = "hidden";
  }, 3000);
}

//setInterval(spawnEnemy, SPAWN_ENEMY_INTERVAL);
//setInterval(spawnHealthpack, SPAWN_HEALTHPACK_INTERVAL);
setInterval(()=>{
  spawnEnemy(1)
}, SPAWN_TYPE_1_ENEMY_INTERVAL);
setInterval(()=>{
  spawnEnemy(2)
}, SPAWN_TYPE_2_ENEMY_INTERVAL);
setInterval(()=>{
  spawnEnemy(3)
},SPAWN_TYPE_3_ENEMY_INTERVAL);
setInterval(()=>{
  spawnEnemy(4)
}, SPAWN_TYPE_4_ENEMY_INTERVAL);
setInterval(spawnHealthpack, SPAWN_HEALTHPACK_INTERVAL);

function render() {
  requestAnimationFrame(render); // Show events
  movePlane();
  keyboardUpdate();
  renderer.render(scene, camera); // Render scene
  stats.update();
}
