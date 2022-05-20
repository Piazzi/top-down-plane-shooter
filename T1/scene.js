import * as THREE from "three";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  InfoBox,
  createGroundPlaneWired,
  onWindowResize,
} from "../libs/util/util.js";
import { keyboardUpdate, cone } from "./player.js";
// import projectile from "./projectile.js";
import { enemy } from "./enemies.js";
import detectCollisionCubes from "./collision.js";
import projectile from "./projectile.js";
import { Vector3 } from "../build/three.module.js";
var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 45, -30)); // Init camera in this position
initDefaultBasicLight(scene);

// Show text information onscreen
showInformation();

// create the ground plane
let plane = createGroundPlaneWired(140, 140, 20, 20);
plane.position.set(0, 0, 40);
let plane2 = createGroundPlaneWired(125, 90, 10, 10);
scene.add(plane);

scene.add(cone);

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

render();

function movePlane() {
  scene.add(plane);
  plane.translateY(0.1);
  if (plane.position.z < -23) {
    plane.position.set(0, 0, 40);
  }
}

function showInformation() {
  // Use this to show information onscreen
  var controls = new InfoBox();
  controls.add("Press WASD keys to move");
  controls.show();
}

export function shoot() {
  var sphereGeometry = new THREE.SphereGeometry(1.2, 32, 16);
  var sphereMaterial = new THREE.MeshLambertMaterial();
  var projectile = new THREE.Mesh(sphereGeometry, sphereMaterial);
  projectile.position.set(
    cone.position.x,
    cone.position.y,
    cone.position.z + 6
  );
  projectile.alive = true;
  setTimeout(() => {
    projectile.alive = false;
    scene.remove(projectile);
  }, 1000);
  scene.add(projectile);

  // setTimeout(() => {
  //   scene.remove(projectile), 10000;
  // });
}

function spawnEnemy() {
  setTimeout(() => {
    scene.add(enemy);
  }, 100);
  enemy.translateZ(-0.3);
  if (enemy.position.z === -45) {
    scene.remove(enemy);
  }
}

function render() {
  requestAnimationFrame(render); // Show events
  movePlane();

  spawnEnemy();
  keyboardUpdate();
  if (detectCollisionCubes(cone, enemy)) {
    cone.position.set(0.0, 4.5, 0.0); // reseta pra posição original
  }
  if (projectile) {
    if (detectCollisionCubes(projectile, enemy)) scene.remove(enemy);
  }

  renderer.render(scene, camera); // Render scene
}
