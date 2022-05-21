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
import detectCollision from "./collision.js";

const SCREEN_TOP = 30;
const SCREEN_BOTTONM = -45;

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
  projectiles.push(projectile);
  projectile.position.set(
    cone.position.x,
    cone.position.y,
    cone.position.z + 3
  );

  scene.add(projectile);
  setInterval(() => {
    projectile.translateZ(0.9);
    if (projectile.position.z >= SCREEN_TOP) {
      scene.remove(projectile);
      return;
    }

    enemies.forEach((enemy) => {
      if (detectCollision(projectile, enemy)) {
        scene.remove(enemy);
        scene.remove(projectile);
        return;
      }
    });
  }, "10");
  console.log(projectiles);
  return;
}

let enemies = [];
let projectiles = [];

function resetGame() {
  enemies.forEach((e) => {
    scene.remove(e);
  });

  enemies = [];
  projectiles = [];
  cone.position.set(0.0, 4.5, 0.0);
}

function spawnEnemy() {
  console.log(enemies);
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  const enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
  const randomPosition = Math.random() * (30 - -30) + -30;
  scene.add(enemy);
  enemies.push(enemy);
  enemy.position.set(randomPosition, 4.5, SCREEN_TOP);

  setInterval(() => {
    enemy.translateZ(-0.1);
    if (enemy.position.z <= SCREEN_BOTTONM) {
      scene.remove(enemy);
      enemies = enemies.filter(e => e.id !== enemy.id);
      return;
    }

    if (detectCollision(cone, enemy)) {
      // enemies.forEach((e) => {
      //   scene.remove(e);
      // });
      scene.remove(enemy);

      resetGame(); // reseta pra posição original
      return;
    }
  }, "10");
  return;
}


// spawna inimigos a cada 2 segundos
setInterval(spawnEnemy, "2000");

function render() {
  requestAnimationFrame(render); // Show events
  movePlane();
  keyboardUpdate();
  renderer.render(scene, camera); // Render scene
}
