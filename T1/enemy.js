import * as THREE from "three";
import {
  scene,
  OFF_SCREEN_BOTTOM,
  OFF_SCREEN_TOP,
  resetGame,
} from "./scene.js";
import { cone } from "./player.js";
import detectCollision from "./collision.js";
function shrink() {
  let scale = 1;
  setInterval(() => {
    if (scale < 0.1) {
      return;
    }
    scale -= 0.1;
    cone.scale.set(scale, scale, scale);
  }, "10");
}
function grow() {
  let scale = 0;
  setInterval(() => {
    if (scale > 0.9) {
      return;
    }
    scale += 0.1;
    cone.scale.set(scale, scale, scale);
  }, "10");
}
// active enemies array on the scene
export var enemies = [];
// create a enemy at a random X position in the scene
export function spawnEnemy() {
  // creates de cube
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  let enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let randomPosition = Math.random() * (30 - -30) + -30;
  scene.add(enemy);
  enemies.push(enemy);
  enemy.position.set(randomPosition, 4.5, OFF_SCREEN_TOP);

  // every 10 ms checks if the enemy hit the player or exit the screen
  setInterval(() => {
    enemy.translateZ(-0.1);
    // remove the enemy if exits the screen
    if (enemy.position.z <= OFF_SCREEN_BOTTOM) {
      scene.remove(enemy);
      enemies = enemies.filter((e) => e.id !== enemy.id);
      return;
    }

    // resets the game if the player hit any enemy
    if (detectCollision(cone, enemy)) {
      scene.remove(enemy);
      enemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink();
      grow();
      resetGame(); // reset the game

      return;
    }
  }, "10");

  return;
}
