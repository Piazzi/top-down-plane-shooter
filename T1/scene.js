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
import detectCollisionCubes from "./collision.js";

var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 45, -30)); // Init camera in this position
initDefaultBasicLight(scene);

// Show text information onscreen
showInformation();

// create the ground plane
let plane = createGroundPlaneWired(140, 140, 20, 20);
plane.position.set(0, 0, 40);

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
  controls.add("Press Spacebar to shoot");
  controls.show();
}

let projectileCooldown = 0;

setInterval(() => {
  if (projectileCooldown >= 0) projectileCooldown--;
}, "1000");

export function shoot() {

  if (!projectileCooldown) return;
  projectileCooldown++;

  var sphereGeometry = new THREE.SphereGeometry(0.6, 16, 8);
  var sphereMaterial = new THREE.MeshLambertMaterial();
  var projectile = new THREE.Mesh(sphereGeometry, sphereMaterial);
  projectile.position.set(
    cone.position.x,
    cone.position.y,
    cone.position.z + 3
  );

  setInterval(() => {
    projectile.translateZ(0.9);
    if (projectile.position.z === 30) {
      scene.remove(projectile);
    }
  }, "10");

  scene.add(projectile);
}

let enemies = [];
let projectiles = [];

function resetGame() {
  enemies = [];
  projectiles = [];
  cone.position.set(0.0, 4.5, 0.0);
}

function removeEnemy(enemy) {
  scene.remove(enemy);
  enemies = enemies.filter(e => {
   console.log( e.id != enemy.id);
  })

}

function spawnEnemy() {
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  const enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
  const randomPosition = Math.random() * (30 - -30) + -30;
  scene.add(enemy);
  enemies.push(enemy);
  console.log(enemies);

  setInterval(() => {
    
    enemy.translateZ(-0.1);
    if (enemy.position.z <= -45) {
       removeEnemy(enemy);
    }

    if (detectCollisionCubes(cone, enemy)) {
      enemies.forEach((e) => {
        scene.remove(e);
      });
      removeEnemy(enemy);
      resetGame(); // reseta pra posição original
      return;
    }
  }, "10");

  enemy.position.set(randomPosition, 4.5, 30.0);
}

// spawna inimigos a cada 2 segundos
setInterval(spawnEnemy, "2000");

function render() {
  requestAnimationFrame(render); // Show events
  movePlane();
  keyboardUpdate();
  renderer.render(scene, camera); // Render scene
}
