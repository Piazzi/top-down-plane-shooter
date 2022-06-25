import * as THREE from "three";
import { scene, resetGame } from "./scene.js";
import {
  grow,
  playerGeometry,
  shrink,
  GOD_MODE,
  increasePlayerLife,
  playerLife,
} from "./player.js";
import detectCollision from "./collision.js";
import { removeHearts } from "./interface.js";
import {
  HEIGHT,
  MAX_ENEMY_SPEED,
  MIN_ENEMY_SPEED,
  OFF_SCREEN_BOTTOM,
  OFF_SCREEN_TOP,
  SCREEN_LEFT_EDGE,
  SCREEN_RIGHT_EDGE,
} from "./config.js";

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
export function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// active enemies array on the scene
export var enemies = [];

// create a enemy at a random X position in the scene
export function spawnEnemy() {
  // creates de cube
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color: generateColor(), // Main color of the object
    shininess: "200", // Shininess of the object
    specular: "rgb(255,255,255)", // Color of the specular component
  });
  let enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let randomPosition = getRandomNumber(SCREEN_LEFT_EDGE, SCREEN_RIGHT_EDGE);
  let randomSpeed = getRandomNumber(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
  enemy.alive = true;
  scene.add(enemy);
  enemies.push(enemy);
  enemy.position.set(randomPosition, HEIGHT, OFF_SCREEN_TOP);
  enemy.castShadow = true;
  enemy.receiveShadow = true;
  enemy.visible = true;

  // every 10 ms checks if the enemy hit the player or exit the screen
  setInterval(() => {
    if (playerLife <= 0) {
      resetGame();
      increasePlayerLife(5);
      return;
    }

    enemy.translateZ(randomSpeed);
    // remove the enemy if exits the screen
    if (enemy.position.z <= OFF_SCREEN_BOTTOM) {
      scene.remove(enemy);
      enemies = enemies.filter((e) => e.id !== enemy.id);
      return;
    }

    // resets the game if the player hit any enemy
    if (detectCollision(playerGeometry, enemy) && enemy.alive) {
      if (!GOD_MODE) {
        increasePlayerLife(-1);
        removeHearts(1);
      }
      enemy.alive = false;
      scene.remove(enemy);
      enemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(playerGeometry);
      grow(playerGeometry);
    }
  }, "10");

  return;
}
