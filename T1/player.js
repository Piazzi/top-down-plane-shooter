import KeyboardState from "../libs/util/KeyboardState.js";
import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { shoot } from "./scene.js";
// create a cone
const geometry = new THREE.ConeGeometry(4, 10, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xfeaa00 });
export const cone = new THREE.Mesh(geometry, material);
cone.rotation.set(0, 0, 0);

// position the cone
cone.position.set(0.0, 4.5, 0.0);
cone.rotateX(degreesToRadians(90));
// add the cube to the scene

// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var stone = textureLoader.load("../assets/textures/floor-wood.jpg");

// Add texture to the 'map' property of the object's material
cone.material.map = stone;

// To use the keyboard
var keyboard = new KeyboardState();

var clock = new THREE.Clock();

export function keyboardUpdate() {
  keyboard.update();

  var speed = 30;
  var moveDistance = speed * clock.getDelta();

  // Keyboard.pressed - execute while is pressed
  if (keyboard.pressed("A")) cone.translateX(moveDistance);
  if (keyboard.pressed("D")) cone.translateX(-moveDistance);
  if (keyboard.pressed("W")) cone.translateY(moveDistance);
  if (keyboard.pressed("S")) cone.translateY(-moveDistance);
  if (keyboard.pressed("space")) shoot();
}
