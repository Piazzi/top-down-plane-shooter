import * as THREE from "three";
import {
  scene,
  OFF_SCREEN_BOTTOM,
  OFF_SCREEN_TOP,
  OFF_SCREEN_RIGHT,
  OFF_SCREEN_LEFT,
  resetGame,
  SCREEN_LEFT_EDGE,
  SCREEN_RIGHT_EDGE,
  SCREEN_TOP_EDGE,
  SCREEN_BOTTOM_EDGE,
  HEIGHT,
} from "./scene.js";

import { player, grow, paperChildren, paperPlane, shrink, GOD_MODE } from "./player.js";
import detectCollision from "./collision.js";
import { removeHearts } from "./interface.js";
import { degreesToRadians } from "../../libs/util/util.js";

export var playerLife = 5;

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
export var enemies2 = [];
export var enemies3 = [];
export var enemies4 = [];
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
  enemy.receiveShadow = true;
  enemy.visible = true;

  // every 10 ms checks if the enemy hit the player or exit the screen
  setInterval(() => {

    if(playerLife <= 0) {
      resetGame();
      playerLife = 5;
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
    if (detectCollision(paperChildren, enemy) && enemy.alive) {
      
      if(!GOD_MODE) {
        playerLife--;
        removeHearts(1);
      }
      enemy.alive = false;
      scene.remove(enemy);
      enemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(player);
      grow(player);

    
    }
  }, "10");

  return;
}



export function spawnEnemy2() {
  // creates de cube
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color:generateColor(),     // Main color of the object
    shininess:"200",            // Shininess of the object
    specular:"rgb(255,255,255)" // Color of the specular component
  });
  let enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let randomPosition = getRandomNumber(SCREEN_TOP_EDGE, SCREEN_BOTTOM_EDGE);
  let randomSpeed = getRandomNumber(-0.1, -0.3);
  scene.add(enemy);
  enemies2.push(enemy);
  enemy.position.set(OFF_SCREEN_RIGHT, HEIGHT, randomPosition);
  enemy.castShadow = true;
  enemy.receiveShadow = true;
  enemy.visible = true;

 
  // every 10 ms checks if the enemy hit the player or exit the screen
  setInterval(() => {

    if(playerLife <= 0) {
      resetGame();
      playerLife = 5;
      return;
    }

    enemy.translateX(randomSpeed);
    // remove the enemy if exits the screen
    if (enemy.position.x <= OFF_SCREEN_LEFT) {
      scene.remove(enemy);
      enemies2 = enemies2.filter((e) => e.id !== enemy.id);
      return;
    }

    // resets the game if the player hit any enemy
    if (detectCollision(cone, enemy)) {
      playerLife--;     
      removeHearts(1);
      scene.remove(enemy);
      enemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(cone);
      grow(cone);
    
    }
  }, "10");

  return;
}

export function spawnEnemy3() {
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
  enemies3.push(enemy);
  enemy.position.set(OFF_SCREEN_RIGHT, HEIGHT, OFF_SCREEN_TOP);
  enemy.castShadow = true;
  enemy.receiveShadow = true;
  enemy.visible = true;
  enemy.rotateY(degreesToRadians(10));

  // every 10 ms checks if the enemy hit the player or exit the screen
  setInterval(() => {

    if(playerLife <= 0) {
      resetGame();
      playerLife = 5;
      return;
    }
    
    
    enemy.translateZ(randomSpeed);
    enemy.translateX(randomSpeed);
    // remove the enemy if exits the screen
    if (enemy.position.z <= OFF_SCREEN_BOTTOM) {
      scene.remove(enemy);
      enemies3 = enemies3.filter((e) => e.id !== enemy.id);
      return;
    }

    // resets the game if the player hit any enemy
    if (detectCollision(cone, enemy)) {
      playerLife--;     
      removeHearts(1);
      scene.remove(enemy);
      enemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(cone);
      grow(cone);
    
    }
  }, "10");

  return;
}

export function spawnEnemy4() {
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
  enemies4.push(enemy);
  enemy.position.set(OFF_SCREEN_RIGHT, HEIGHT, OFF_SCREEN_TOP);
  enemy.castShadow = true;
  enemy.receiveShadow = true;
  enemy.visible = true;

  // every 10 ms checks if the enemy hit the player or exit the screen
  setInterval(() => {

    if(playerLife <= 0) {
      resetGame();
      playerLife = 5;
      return;
    }
    
    enemy.rotateY(degreesToRadians(0.2))
    enemy.translateZ(randomSpeed);
    enemy.translateX(randomSpeed);
    // remove the enemy if exits the screen
    if (enemy.position.z <= OFF_SCREEN_BOTTOM) {
      scene.remove(enemy);
      enemies4 = enemies4.filter((e) => e.id !== enemy.id);
      return;
    }

    // resets the game if the player hit any enemy
    if (detectCollision(cone, enemy)) {
      playerLife--;     
      removeHearts(1);
      scene.remove(enemy);
      enemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(cone);
      grow(cone);
    
    }
  }, "10");

  return;

}
