import KeyboardState from "../../libs/util/KeyboardState.js";
import * as THREE from "three";
import { degreesToRadians } from "../../libs/util/util.js";
import {
  OFF_SCREEN_BOTTOM,
  OFF_SCREEN_TOP,
  SCREEN_BOTTOM_EDGE,
  SCREEN_LEFT_EDGE,
  SCREEN_RIGHT_EDGE,
  SCREEN_TOP_EDGE,
  scene,
  HEIGHT,
  resetGame,
} from "./scene.js";
import { enemies } from "./enemy.js";
import detectCollision from "./collision.js";
import { OBJLoader } from "/build/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/build/jsm/loaders/MTLLoader.js";
import { godMode } from "./interface.js";
// create a cone
const geometry = new THREE.ConeGeometry(2, 5, 8);
const material = new THREE.MeshPhongMaterial({
  color: "0xfeAA00", // Main color of the object
  shininess: "150", // Shininess of the object
  specular: "rgb(255,255,255)", // Color of the specular component
});

export let GOD_MODE = false;
export const player = new THREE.Mesh(geometry, material);
export var projectileCooldown = 0;
// active projectiles array on the scene
export var projectiles = [];

// position the cone
player.rotation.set(0, 0, 0);
player.position.set(0.0, HEIGHT, 0.0);
player.rotateX(degreesToRadians(90));
player.castShadow = true;
player.receiveShadow = true;
player.visible = true;

//importing 3D model airplane player
export var paperPlane = undefined;
export var paperChildren = undefined;
const mtlLoader = new MTLLoader();
mtlLoader.load("./materials/paper_plane.mtl", (materials) => {
  materials.preload();
  const objLoader = new OBJLoader();
  // console.log(objLoader);
  objLoader.setMaterials(materials);
  objLoader.load("./assets/paper_plane.obj", (object) => {
    paperPlane = object;

    paperPlane.children[0].castShadow = true;
    paperChildren = paperPlane.children[0];
    paperPlane.scale.set(0.2, 0.2, 0.2);
    paperPlane.rotateY(degreesToRadians(180));
    paperPlane.position.set(0.0, HEIGHT, 0.0);
    scene.add(paperPlane);
  });
});
// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var stone = textureLoader.load("../assets/textures/floor-wood.jpg");
var explosion = textureLoader.load("../assets/textures/11.png");

// Add texture to the 'map' property of the object's material
player.material.map = stone;
// To use the keyboard
var keyboard = new KeyboardState();

var clock = new THREE.Clock();

// detect the player controls
export function keyboardUpdate() {
  keyboard.update();

  var speed = 30;
  var moveDistance = speed * clock.getDelta();

  // Keyboard.pressed - execute while is pressed
  // checks if the player is on the playable zone (in screen)
  if (keyboard.pressed("left") && paperPlane.position.x <= SCREEN_RIGHT_EDGE)
    paperPlane.translateX(-moveDistance);
  if (keyboard.pressed("right") && paperPlane.position.x >= SCREEN_LEFT_EDGE)
    paperPlane.translateX(moveDistance);
  if (keyboard.pressed("up") && paperPlane.position.z <= SCREEN_TOP_EDGE)
    paperPlane.translateZ(-moveDistance);
  if (keyboard.pressed("down") && paperPlane.position.z >= SCREEN_BOTTOM_EDGE)
    paperPlane.translateZ(moveDistance);
  if (keyboard.pressed("ctrl")) 
    shoot();
  if (keyboard.pressed("enter"))
    resetGame();
  if (keyboard.pressed("G")) {
    if( godMode.style.visibility == 'visible')
      godMode.style.visibility = 'hidden';
    else
      godMode.style.visibility = 'visible';

    GOD_MODE = !GOD_MODE;
  }
}


// shoot function for the player
export function shoot() {
  // if is on cooldown, the plane cannot shoot
  if (!projectileCooldown) return;
  projectileCooldown++;

  // creates the projectile
  var sphereGeometry = new THREE.SphereGeometry(0.6, 16, 8);
  var sphereMaterial = new THREE.MeshLambertMaterial({ color: "#FEFE00" });
  var projectile = new THREE.Mesh(sphereGeometry, sphereMaterial);
  projectile.castShadow = true;
  projectiles.push(projectile);
  projectile.position.set(
    paperPlane.position.x,
    paperPlane.position.y,
    paperPlane.position.z + 3
  );

  scene.add(projectile);

  // every 10 ms checks if the projectile hit any enemy or exit the screen
  setInterval(() => {
    projectile.translateZ(0.9);

    // remove the projectile if exits the screen
    if (projectile.position.z >= OFF_SCREEN_TOP) {
      scene.remove(projectile);
      projectiles = projectiles.filter((p) => p.id !== projectile.id);
      return;
    }

    // check if the projectile hit any enemy, remove the enemy
    // and the projectile if did hit
    enemies.forEach((enemy) => {
      if (detectCollision(projectile, enemy)) {
        shrink(enemy);
        enemy.alive = false;
        scene.remove(projectile);
        projectile.position.set(0, 0, OFF_SCREEN_BOTTOM);
        // wait 200ms before removing the enemy so that the animation can play
        setTimeout(function () {
          enemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
          scene.remove(enemy);

          return;
        }, 200);
      }
    });
  }, "10");

  return;
}

// reduce projectile cooldown
setInterval(() => {
  if (projectileCooldown >= 0) projectileCooldown--;
}, "500");

// makes the mesh shrinks in scale
export function shrink(mesh) {
  mesh.material.map = explosion;
  let scale = 1;
  setInterval(() => {
    if (scale < 0.1) {
      return;
    }
    scale -= 0.1;
    mesh.scale.set(scale, scale, scale);
    mesh.material.map = stone;
  }, "100");
}

// makes the mesh grow in scale
export function grow(mesh) {
  let scale = 0;
  setInterval(() => {
    if (scale > 0.9) {
      return;
    }
    scale += 0.1;
    mesh.scale.set(scale, scale, scale);
  }, "100");
}
