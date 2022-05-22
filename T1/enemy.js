import * as THREE from "three";
import {
  scene,
  OFF_SCREEN_BOTTOM,
  OFF_SCREEN_TOP,
  resetGame,
} from "./scene.js";
import { cone } from "./player.js";
import detectCollision from "./collision.js";

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

      resetGame(); // reset the game
      return;
    }
  }, "10");
  return;
}
