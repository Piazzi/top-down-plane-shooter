import * as THREE from "three";
import {
  scene,
  resetGame,
  enemyMissileSound,
  explosionSound,
} from "./scene.js";
import {
  grow,
  playerGeometry,
  player,
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
  OFF_SCREEN_LEFT,
  OFF_SCREEN_RIGHT,
  SCREEN_LEFT_EDGE,
  SCREEN_RIGHT_EDGE,
  ENEMY_PROJECTILE_SPEED,
  GROUND_ENEMY_POSITION,
  GROUND_ENEMY_SPEED,
  LEFT_OF_THE_RIVER,
  RIGHT_OF_THE_RIVER,
} from "./config.js";
import { degreesToRadians } from "../../libs/util/util.js";
import { boat, missile, plane } from "./models.js";
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
export var projectileEnemies = [];

function spawn(object, x, y, z) {
  object.alive = true;
  scene.add(object);
  enemies.push(object);
  object.position.set(x, y, z);
  object.castShadow = true;
  object.receiveShadow = true;
  object.visible = true;

  setInterval(() => {
    if (detectCollision(playerGeometry, object.children[0]) && object.alive) {
      if (!GOD_MODE) {
        increasePlayerLife(-1);
        removeHearts(1);
        explosionSound.play();
      }
      object.alive = false;
      scene.remove(object);
      object.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(playerGeometry);
      grow(playerGeometry);
    }
  }, "10");
}

// create a enemy at a random X position in the scene
export function spawnEnemy(type) {
  //create standard enemy
  let enemy = plane.clone();
  let i = 0;
  plane.children.forEach((mesh) => {
    plane.children[i] = mesh.clone();
    i++;
  });
  let enemy2 = boat.clone();
  i = 0;
  boat.children.forEach((mesh) => {
    boat.children[i] = mesh.clone();
    i++;
  });

  let randomPosition = getRandomNumber(SCREEN_LEFT_EDGE, SCREEN_RIGHT_EDGE);
  let randomPositionLow = getRandomNumber(LEFT_OF_THE_RIVER, RIGHT_OF_THE_RIVER);
  let randomSpeed = getRandomNumber(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);

  if (type === 1) {
    spawn(enemy, randomPosition, HEIGHT, OFF_SCREEN_TOP);
    setTimeout(() => {
      shootEnemy(enemy, 1);
    }, "500");
  }
  if (type === 2) {
    spawn(enemy, OFF_SCREEN_RIGHT, HEIGHT, randomPosition);
    setTimeout(() => {
      shootEnemy(enemy, 1);
    }, "500");
  }
  if (type === 3) {
    spawn(enemy, OFF_SCREEN_RIGHT, HEIGHT, OFF_SCREEN_TOP);
    setTimeout(() => {
      shootEnemy(enemy, 1);
    }, "500");
  }

  if (type === 4) {
    spawn(enemy, OFF_SCREEN_RIGHT, HEIGHT, 20);
    setTimeout(() => {
      shootEnemy(enemy, 1);
    }, "500");
  }

  if (type === 5) {
    spawn(enemy2, randomPositionLow, GROUND_ENEMY_POSITION, OFF_SCREEN_TOP);
    setTimeout(() => {
      shootEnemy(enemy, 2);
    }, "2000");
  }

  // every 10 ms checks if the enemy hit the player or exit the screen

  setInterval(() => {
    if (playerLife <= 0) {
      resetGame();
      increasePlayerLife(5, 2);
      return;
    }
    if (type === 1) {
      enemy.translateZ(randomSpeed);
    }
    if (type === 2) {
      enemy.translateX(randomSpeed);
    }
    if (type === 3) {
      enemy.translateX(randomSpeed);
      enemy.translateZ(randomSpeed);
    }
    if (type === 4) {
      enemy.translateZ(randomSpeed);
      enemy.translateX(randomSpeed);
      enemy.rotateY(degreesToRadians(0.25));
    }
    if (type === 5) {
      enemy2.translateX(-GROUND_ENEMY_SPEED);
    }
    // remove the enemy if exits the screen
    if (enemy.position.z <= OFF_SCREEN_BOTTOM) {
      scene.remove(enemy);
      enemies = enemies.filter((e) => e.id !== enemy.id);
      return;
    }

    // resets the game if the player hit any enemy
  }, "10");

  return;
}
export function shootEnemy(object, type) {
  // creates the projectile
  // var sphereGeometry = new THREE.SphereGeometry(0.6, 16, 8);
  // var sphereMaterial = new THREE.MeshLambertMaterial({ color: "#FEFE00" });
  // var projectileEnemy = new THREE.Mesh(sphereGeometry, sphereMaterial);
  var projectileEnemy = missile.clone();
  projectileEnemy.alive = true;
  projectileEnemy.castShadow = true;
  projectileEnemies.push(projectileEnemy);
  projectileEnemy.position.set(
    object.position.x,
    object.position.y,
    object.position.z + 3
  );

  let projectileDestination = new THREE.Vector3(
    player.position.x,
    player.position.y,
    player.position.z
  );
  enemyMissileSound.play();

  projectileEnemy.lookAt(projectileDestination);
  scene.add(projectileEnemy);
  if (type === 2) {
    projectileEnemy.rotateX(degreesToRadians(90));
    setInterval(() => {
      if (projectileEnemy.position.y <= HEIGHT) {
        projectileEnemy.translateY(0.1);
      }
    }, "5");
  }
  // every 10 ms checks if the projectileEnemy hit any object or exit the screen
  setInterval(() => {
    if (projectileEnemy.position.y >= HEIGHT) {
      projectileEnemy.translateZ(ENEMY_PROJECTILE_SPEED);
    }

    // remove the projectile if exits the screen
    if (
      projectileEnemy.position.z <= OFF_SCREEN_BOTTOM ||
      projectileEnemy.position.z >= OFF_SCREEN_TOP ||
      projectileEnemy.position.x <= OFF_SCREEN_LEFT ||
      projectileEnemy.position.x >= OFF_SCREEN_RIGHT
    ) {
      scene.remove(projectileEnemy);
      projectileEnemies = projectileEnemies.filter(
        (p) => p.id !== projectileEnemy.id
      );
      return;
    }

    // check if the projectile hit any object, remove the object
    // and the projectile if did hit
    if (
      detectCollision(playerGeometry, projectileEnemy.children[0]) &&
      projectileEnemy.alive
    ) {
      if (!GOD_MODE) {
        increasePlayerLife(-1);
        removeHearts(1);
      }
      projectileEnemy.alive = false;
      scene.remove(projectileEnemy);
      projectileEnemy.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(playerGeometry);
      grow(playerGeometry);
      // wait 200ms before removing the object so that the animation can play
    }
  }, "10");
  return;
}
