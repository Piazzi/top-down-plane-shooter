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
  PLANE_SPEED,
} from "./config.js";

// active enemies array on the scene
export var healthpacks = [];
// create a healthpack at a random X position in the scene
export function spawnHealthpack() {
  var geometry = new THREE.CylinderGeometry(2, 2, 1, 32);

  const healthMaterial = new THREE.MeshPhongMaterial({
    color: "darkred", // Main color of the object
    shininess: "0", // Shininess of the object
    specular: "rgb(255,255,255)", // Color of the specular component
  });
  let healthBlueprint = new THREE.Mesh(geometry, healthMaterial);
  healthBlueprint.usable = true;
  healthBlueprint.position.set(0, 5, 0);
  healthBlueprint.castShadow = true;
  healthBlueprint.receiveShadow = true;
  healthBlueprint.visible = true;
  // scene.add(healthBlueprint);
  var h1Geometry = new THREE.BoxGeometry(2, 1.2, 0.7);
  var h2Geometry = new THREE.BoxGeometry(0.7, 1.2, 2);
  const hMaterial = new THREE.MeshBasicMaterial({
    color: "white",
  });
  let hole1 = new THREE.Mesh(h1Geometry, hMaterial);
  let hole2 = new THREE.Mesh(h2Geometry, hMaterial);
  hole1.castShadow = true;
  hole1.receiveShadow = true;
  hole1.visible = true;
  hole2.castShadow = true;
  hole2.receiveShadow = true;
  hole2.visible = true;
  hole1.position.set(0, 5, 0);
  hole2.position.set(0, 5, 0);
  let healthpackCSG = CSG.fromMesh(healthBlueprint);
  let hole1CSG = CSG.fromMesh(hole1);
  let hole2CSG = CSG.fromMesh(hole2);
  let passo1 = healthpackCSG.subtract(hole1CSG);
  let passo2 = passo1.subtract(hole2CSG);
  let healthpack = CSG.toMesh(passo2, new THREE.Matrix4());
  healthpack.material = new THREE.MeshPhongMaterial({
    color: "darkred", // Main color of the object
    shininess: "0", // Shininess of the object
    specular: "rgb(255,255,255)", // Color of the specular component
  });
  let randomPosition = getRandomNumber(SCREEN_LEFT_EDGE, SCREEN_RIGHT_EDGE);
  healthpack.position.set(randomPosition, HEIGHT, OFF_SCREEN_TOP);
  scene.add(healthpack);
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
