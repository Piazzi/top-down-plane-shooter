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
import { CSG } from "../../libs/other/CSGMesh.js";
// active enemies array on the scene
export var healthpacks = [];
// create a healthpack at a random X position in the scene
export function spawnHealthpack() {
  // creates de cube
  var geometry = new THREE.CylinderGeometry(2, 2, 1, 32);

  const healthMaterial = new THREE.MeshPhongMaterial({
    color: "darkred", // Main color of the object
    shininess: "0", // Shininess of the object
    specular: "rgb(255,255,255)", // Color of the specular component
  });
  // let healthpack = new THREE.Mesh(geometry, healthMaterial);
  // healthpack.rotateZ(degreesToRadians(90));
  let cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 32));
  let corte = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 32));
  corte.rotateZ(degreesToRadians(90));
  corte.rotateX(degreesToRadians(90));
  let cylinderCSG = CSG.fromMesh(cylinderMesh);
  let corteCSG = CSG.fromMesh(corte);
  let objeto = cylinderCSG.subtract(corteCSG);
  let healthpack = CSG.toMesh(objeto, healthMaterial);
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
