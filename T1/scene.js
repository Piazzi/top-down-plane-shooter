import * as THREE from "three";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  InfoBox,
  createGroundPlaneWired,
  onWindowResize,
} from "../libs/util/util.js";
import { keyboardUpdate, cone, projectiles } from "./player.js";
import { spawnEnemy, enemies } from "./enemy.js";

export const OFF_SCREEN_TOP = 30;
export const OFF_SCREEN_BOTTON = -45;

export var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 45, -30)); // Init camera in this position
initDefaultBasicLight(scene);



// Show text information onscreen
showInformation();

// create the ground plane
let plane = createGroundPlaneWired(140, 200, 20, 20);
plane.position.set(0, 0, 40);

// adds the plane and the player to the scene
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

export function generateColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  
  return color;
  
}

// move the plane against the player to simulate movement
function movePlane() {
  scene.add(plane);
  plane.translateY(0.1);
  if (plane.position.z < OFF_SCREEN_BOTTON) {
    plane.position.set(0, 0, 40);
  }
}

function showInformation() {
  // Use this to show information onscreen
  var controls = new InfoBox();
  controls.add("Press WASD keys to move");
  controls.add("Press Spacebar to shoot");
  controls.show();
}

// resets the game removing all active
// enemies, projectiles and setting the players position
export function resetGame() {
  enemies.forEach((e) => {
    scene.remove(e);
  });
  enemies.length = 0;
  projectiles.length = 0;
  cone.position.set(0.0, 4.5, 0.0);
}

// spawn a enemy every 2 seconds
setInterval(spawnEnemy, "2000");

function render() {
  requestAnimationFrame(render); // Show events
  movePlane();
  keyboardUpdate();
  renderer.render(scene, camera); // Render scene
}
