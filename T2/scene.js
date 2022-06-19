import * as THREE from "three";
import {
  initRenderer,
  initCamera,
  InfoBox,
  createGroundPlaneWired,
  onWindowResize,
} from "../libs/util/util.js";
import { keyboardUpdate, cone, projectiles } from "./player.js";
import { spawnEnemy, enemies } from "./enemy.js";
import { Clock } from "../build/three.module.js";
import { dirLight, ambientLight } from "./lighting.js";

export const OFF_SCREEN_TOP = 30;
export const OFF_SCREEN_BOTTOM = -45;
export const SCREEN_LEFT_EDGE = -30;
export const SCREEN_RIGHT_EDGE = 30;
export const SCREEN_TOP_EDGE = 20;
export const SCREEN_BOTTOM_EDGE = -15;
export var HEIGHT = 10;

export var clock = new Clock(true);
export var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 45, -30)); // Init camera in this position

// Show text information onscreen
showInformation();

// create the ground plane
let plane = createGroundPlaneWired(140, 200, 20, 20, "#546A76");
plane.position.set(0, 0, 0);
let plane2 = createGroundPlaneWired(140, 200, 20, 20, "#222b30");
plane2.position.set(0, 0, 200);

// adds the player to the scene
scene.add(cone);
scene.add(dirLight);
scene.add(ambientLight);

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
  plane.translateY(0.1);
  plane2.translateY(0.1);

  if (plane2.position.z < 0 && plane2.position.z > -0.1) {
    plane.position.z = 200;
  } else if (plane.position.z < 0 && plane.position.z > -0.1) {
    plane2.position.z = 200;
  }
}

function showInformation() {
  // Use this to show information onscreen
  var controls = new InfoBox();
  controls.add("Press Arrow keys to move");
  controls.add("Press CTRL to shoot");
  controls.show();
}

// resets the game removing all active
// enemies, projectiles and setting the players position
export function resetGame() {
  enemies.forEach((e) => {
    scene.remove(e);
  });
  projectiles.length = 0;
  enemies.length = 0;
  cone.position.set(0, HEIGHT, 0);
  clock.start();
}

let clockText = document.getElementById('clock');

// spawn a enemy every 2 seconds
setInterval(spawnEnemy, "2000");
// show clock time
setInterval(() => {clockText.innerText = clock.getElapsedTime().toFixed()}, "1000")

function render() {
  requestAnimationFrame(render); // Show events
  movePlane();
  keyboardUpdate();
  renderer.render(scene, camera); // Render scene
}
