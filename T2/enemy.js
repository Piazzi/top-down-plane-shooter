import * as THREE from "three";
import {
  scene,
  OFF_SCREEN_BOTTOM,
  OFF_SCREEN_TOP,
  resetGame,
  SCREEN_LEFT_EDGE,
  SCREEN_RIGHT_EDGE,
  HEIGHT,
} from "./scene.js";
import { cone, grow, shrink } from "./player.js";
import detectCollision from "./collision.js";

// generate a random color for the enemy
export function generateColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

//Returns a random number between min (inclusive) and max (exclusive)
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// active enemies array on the scene
export var enemies = [];
// create a enemy at a random X position in the scene
export function spawnEnemy() {
  // creates de cube
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color:generateColor(),     // Main color of the object
    shininess:"200",            // Shininess of the object
    specular:"rgb(255,255,255)" // Color of the specular component
  });
  let enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let randomPosition = getRandomNumber(SCREEN_LEFT_EDGE, SCREEN_RIGHT_EDGE);
  let randomSpeed = getRandomNumber(-0.1, -0.3);
  scene.add(enemy);
  enemies.push(enemy);
  enemy.position.set(randomPosition, HEIGHT, OFF_SCREEN_TOP);
  enemy.castShadow = true;
  enemy.visible = true;

  // every 10 ms checks if the enemy hit the player or exit the screen
  setInterval(() => {
    enemy.translateZ(randomSpeed);
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
      shrink(cone);
      grow(cone);
      resetGame(); // reset the game
      return;
    }
  }, "10");

  return;
}
