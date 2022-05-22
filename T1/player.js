import KeyboardState from "../libs/util/KeyboardState.js";
import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { OFF_SCREEN_BOTTOM, scene } from "./scene.js";
import { OFF_SCREEN_TOP } from "./scene.js";
import { enemies } from "./enemy.js";
import detectCollision from "./collision.js";

// create a cone
const geometry = new THREE.ConeGeometry(2, 5, 8);
const material = new THREE.MeshLambertMaterial({ color: 0xfeaa00 });
export const cone = new THREE.Mesh(geometry, material);
export const SCREEN_LEFT_EDGE = -30;
export const SCREEN_RIGHT_EDGE = 30;
export const SCREEN_TOP_EDGE = 20;
export const SCREEN_BOTTOM_EDGE = -15;

export var projectileCooldown = 0;
// active projectiles array on the scene
export var projectiles = [];

// position the cone
cone.rotation.set(0, 0, 0);
cone.position.set(0.0, 4.5, 0.0);
cone.rotateX(degreesToRadians(90));

// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var stone = textureLoader.load("../assets/textures/floor-wood.jpg");
var explosion = textureLoader.load("../assets/textures/11.png");

// Add texture to the 'map' property of the object's material
cone.material.map = stone;
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
  if (keyboard.pressed("A") && cone.position.x <= SCREEN_RIGHT_EDGE)
    cone.translateX(moveDistance);
  if (keyboard.pressed("D") && cone.position.x >= SCREEN_LEFT_EDGE)
    cone.translateX(-moveDistance);
  if (keyboard.pressed("W") && cone.position.z <= SCREEN_TOP_EDGE)
    cone.translateY(moveDistance);
  if (keyboard.pressed("S") && cone.position.z >= SCREEN_BOTTOM_EDGE)
    cone.translateY(-moveDistance);
  if (keyboard.pressed("space")) shoot();
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
  projectiles.push(projectile);
  projectile.position.set(
    cone.position.x,
    cone.position.y,
    cone.position.z + 3
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
        projectile.position.set(0, 0, OFF_SCREEN_BOTTOM);
        scene.remove(projectile);
        enemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
        scene.remove(enemy);
        return;
      }
    });
  }, "10");

  return;
}

// reduce projectile cooldown
setInterval(() => {
  if (projectileCooldown >= 0) projectileCooldown--;
}, "1000");

// shrinks the player when he gets hit by a enemy
export function shrink() {
  cone.material.map = explosion;
  let scale = 1;
  setInterval(() => {
    if (scale < 0.1) {
      return;
    }
    scale -= 0.1;
    cone.scale.set(scale, scale, scale);
    cone.material.map = stone;
  }, "100");
}

export function grow() {
  let scale = 0;
  setInterval(() => {
    if (scale > 0.9) {
      return;
    }
    scale += 0.1;
    cone.scale.set(scale, scale, scale);
  }, "100");
}
