import * as THREE from "three";
import { scene } from "./scene.js";
import { playerGeometry, increasePlayerLife } from "./player.js";
import detectCollision from "./collision.js";
import { addHearts } from "./interface.js";
import { getRandomNumber } from "./enemy.js";
import { degreesToRadians } from "../../libs/util/util.js";
import {
  HEIGHT,
  OFF_SCREEN_BOTTOM,
  OFF_SCREEN_TOP,
  SCREEN_LEFT_EDGE,
  SCREEN_RIGHT_EDGE,
  PLANE_SPEED
} from "./config.js";

// active enemies array on the scene
export var healthpacks = [];
// create a healthpack at a random X position in the scene
export function spawnHealthpack() {
  // creates de cube
  var geometry = new THREE.SphereGeometry(1, 16, 16);
  geometry.applyMatrix4(new THREE.Matrix4().makeScale(1.0, 1.8, 1.6));
  const healthMaterial = new THREE.MeshPhongMaterial({
    color: "darkred", // Main color of the object
    shininess: "0", // Shininess of the object
    specular: "rgb(255,255,255)", // Color of the specular component
  });
  let healthpack = new THREE.Mesh(geometry, healthMaterial);
  let randomPosition = getRandomNumber(SCREEN_LEFT_EDGE, SCREEN_RIGHT_EDGE);
  healthpack.usable = true;
  scene.add(healthpack);
  healthpacks.push(healthpack);
  healthpack.rotateZ(degreesToRadians(90));
  healthpack.position.set(randomPosition, HEIGHT, OFF_SCREEN_TOP);
  healthpack.castShadow = true;
  healthpack.receiveShadow = true;
  healthpack.visible = true;
  // every 10 ms checks if the healthpack hit the player or exit the screen
  setInterval(() => {
    healthpack.translateZ(-PLANE_SPEED);
    if (detectCollision(playerGeometry, healthpack) && healthpack.usable) {
      healthpack.usable = false;
      increasePlayerLife(1);
      addHearts(1);
      scene.remove(healthpack);
      healthpack.position.set(0, 0, OFF_SCREEN_BOTTOM);
    }
  }, "10");

  return;
}
