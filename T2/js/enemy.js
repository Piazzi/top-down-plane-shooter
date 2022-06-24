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
import { cone, grow, paperChildren, paperPlane, shrink } from "./player.js";
import detectCollision from "./collision.js";
import { removeHearts } from "./interface.js";
import { OBJLoader } from "/build/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/build/jsm/loaders/MTLLoader.js";
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
export var clip = undefined;
export var clipChildren = undefined;
// create a enemy at a random X position in the scene
export function spawnEnemy() {
  //importing 3D model airplane player
  const mtlLoader = new MTLLoader();
  mtlLoader.load("./materials/paper_clip.mtl", (materials) => {
    materials.preload();
    const objLoader = new OBJLoader();
    // console.log(objLoader);
    objLoader.setMaterials(materials);
    objLoader.load("./assets/paper_clip.obj", (object) => {
      clip = object;
      clip.children[0].castShadow = true;
      clip.children[0].receiveShadow = true;
      clipChildren = clip.children[0];
      clip.scale.set(0.2, 0.2, 0.2);
      clip.rotateY(degreesToRadians(180));
      // clip.position.set(0.0, HEIGHT, 0.0);
      scene.add(clip);
      clip.alive = true;
      let randomPosition = getRandomNumber(SCREEN_LEFT_EDGE, SCREEN_RIGHT_EDGE);
      let randomSpeed = getRandomNumber(-0.1, -0.3);
      enemies.push(clip);
      clip.position.set(randomPosition, HEIGHT, OFF_SCREEN_TOP);
      clip.translateZ(randomSpeed);
    });
  });
  // // creates de cube
  // const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  // const cubeMaterial = new THREE.MeshPhongMaterial({
  //   color: generateColor(), // Main color of the object
  //   shininess: "200", // Shininess of the object
  //   specular: "rgb(255,255,255)", // Color of the specular component
  // });
  // let enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // let randomPosition = getRandomNumber(SCREEN_LEFT_EDGE, SCREEN_RIGHT_EDGE);
  // let randomSpeed = getRandomNumber(-0.1, -0.3);
  // enemy.alive = true;
  // scene.add(enemy);
  // enemies.push(enemy);
  // enemy.position.set(randomPosition, HEIGHT, OFF_SCREEN_TOP);
  // enemy.castShadow = true;
  // enemy.receiveShadow = true;
  // enemy.visible = true;

  // every 10 ms checks if the enemy hit the player or exit the screen
  setInterval(() => {
    if (playerLife <= 0) {
      resetGame();
      playerLife = 5;
      return;
    }

    // remove the enemy if exits the screen
    if (clip.position.z <= OFF_SCREEN_BOTTOM) {
      scene.remove(clip);
      enemies = enemies.filter((e) => e.id !== clip.id);
      return;
    }

    // resets the game if the player hit any clip
    if (detectCollision(paperChildren, clipChildren) && clip.alive) {
      playerLife--;
      removeHearts(1);
      clip.alive = false;
      scene.remove(clip);
      clip.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(paperPlane);
      grow(paperPlane);
    }
  }, "10");

  return;
}
