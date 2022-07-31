import KeyboardState from "../../libs/util/KeyboardState.js";
import * as THREE from "three";
import { scene, playerMissileSound, explosionSound } from "./scene.js";
import { enemies } from "./enemy.js";
import detectCollision from "./collision.js";
import { OBJLoader } from "/build/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/build/jsm/loaders/MTLLoader.js";
import { degreesToRadians } from "../../libs/util/util.js";
import {
  HEIGHT,
  OFF_SCREEN_BOTTOM,
  OFF_SCREEN_TOP,
  PLAYER_SPEED,
  PLAYER_PROJECTILE_SPEED,
  SCREEN_BOTTOM_EDGE,
  SCREEN_LEFT_EDGE,
  SCREEN_RIGHT_EDGE,
  SCREEN_TOP_EDGE,
  SHOOT_COOLDOWN,
} from "./config.js";
import { playerProjectile } from "./models.js";
export var playerLife = 5;

export function increasePlayerLife(num) {
  playerLife += num;
}

export function toggleGodMode() {
  GOD_MODE = !GOD_MODE;
}

export let GOD_MODE = false;
// export const player = new THREE.Mesh(geometry, material);
export var projectileCooldown = 0;
// active projectiles array on the scene
export var projectiles = [];

// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();

//importing 3D model airplane player
export var player = undefined;
export var playerGeometry = undefined;
const mtlLoader = new MTLLoader();
mtlLoader.load("./materials/plane_low.mtl", (materials) => {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load("./assets/plane_low.obj", (object) => {
    player = object;
    console.log(playerGeometry);
    playerGeometry = player.children[0];

    player.scale.set(0.8, 0.8, 0.8);
    // player.rotateY(degreesToRadians(185));
    player.position.set(0.0, HEIGHT, 0.0);
    // playerGeometry.material[0].shininess = 200;
    // playerGeometry.material[0].specular.r = "255";
    // playerGeometry.material[0].specular.g = "255";
    // playerGeometry.material[0].specular.b = "255";

    scene.add(player);
    console.log(playerGeometry.material);
  });
});
// To use the keyboard
var keyboard = new KeyboardState();

var clock = new THREE.Clock();

// detect the player controls
export function keyboardUpdate() {
  keyboard.update();
  var moveDistance = PLAYER_SPEED * clock.getDelta();

  // Keyboard.pressed - execute while is pressed
  // checks if the player is on the playable zone (in screen)
  if (keyboard.pressed("left") && player.position.x <= SCREEN_RIGHT_EDGE)
    player.translateX(moveDistance);
  if (keyboard.pressed("right") && player.position.x >= SCREEN_LEFT_EDGE)
    player.translateX(-moveDistance);
  if (keyboard.pressed("up") && player.position.z <= SCREEN_TOP_EDGE)
    player.translateZ(moveDistance);
  if (keyboard.pressed("down") && player.position.z >= SCREEN_BOTTOM_EDGE)
    player.translateZ(-moveDistance);
  if (keyboard.pressed("ctrl")) shoot("air");
  if (keyboard.pressed("space")) shoot("land");
}
 
// shoot function for the player
export function shoot(typeOfMissile) {
  // if is on cooldown, the plane cannot shoot
  if (!projectileCooldown) return;
  projectileCooldown++;

  if(playerMissileSound.isPlaying) {
    playerMissileSound.stop();
  }
  playerMissileSound.play( 0.2 );

 
  // creates the projectile
  // var sphereGeometry = new THREE.SphereGeometry(0.6, 16, 8);
  // var sphereMaterial = new THREE.MeshLambertMaterial({ color: "#FEFE00" });
  // var projectile = new THREE.Mesh(sphereGeometry, sphereMaterial);
  var projectile = playerProjectile.clone();
  projectiles.push(projectile);
  projectile.position.set(
    player.position.x,
    player.position.y,
    player.position.z + 3
  );

  if (typeOfMissile == "land") {
    setTimeout(() => {
      setInterval(() => {
        projectile.rotateX(degreesToRadians(1));
      }, "5");
    }, '100');
  }

  scene.add(projectile);

  // every 10 ms checks if the projectile hit any enemy or exit the screen
  setInterval(() => {
    projectile.translateZ(PLAYER_PROJECTILE_SPEED);

    // remove the projectile if exits the screen
    if (projectile.position.z >= OFF_SCREEN_TOP || projectile.position.y < 0) {
      scene.remove(projectile);
      projectiles = projectiles.filter((p) => p.id !== projectile.id);
      return;
    }

    // check if the projectile hit any enemy, remove the enemy
    // and the projectile if did hit
    enemies.forEach((enemy) => {
      if (detectCollision(projectile.children[0], enemy.children[0])) {
        explosionSound.play();
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
}, SHOOT_COOLDOWN);

// makes the mesh shrinks in scale
export function shrink(mesh) {
  let scale = 1;
  setInterval(() => {
    if (scale < 0.1) {
      return;
    }
    scale -= 0.1;
    mesh.scale.set(scale, scale, scale);
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
