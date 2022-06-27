import * as THREE from "three";
import { scene, resetGame } from "./scene.js";
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
  GROUND_ENEMY_SPEED
} from "./config.js";
import { degreesToRadians } from "../../libs/util/util.js";

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
    if (detectCollision(playerGeometry, object) && object.alive) {
      if (!GOD_MODE) {
        increasePlayerLife(-1);
        removeHearts(1);
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
  // creates de cube
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color: generateColor(), // Main color of the object
    shininess: "200", // Shininess of the object
    specular: "rgb(255,255,255)", // Color of the specular component
  });
  let enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let enemy2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let enemy3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let enemy4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let enemy5 = new THREE.Mesh(cubeGeometry, cubeMaterial);
  let randomPosition = getRandomNumber(SCREEN_LEFT_EDGE, SCREEN_RIGHT_EDGE);
  let randomSpeed = getRandomNumber(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
  if (type === 1) {
    spawn(enemy, randomPosition, HEIGHT, OFF_SCREEN_TOP);
    setTimeout(() => {
      shootEnemy(enemy, 1);
    }, "500");
  }
  if (type === 2) {
    spawn(enemy2, OFF_SCREEN_RIGHT, HEIGHT, randomPosition);
    setTimeout(() => {
      shootEnemy(enemy2, 1);
    }, "500");
  }
  if (type === 3) {
    spawn(enemy3, OFF_SCREEN_RIGHT, HEIGHT, OFF_SCREEN_TOP);
    setTimeout(() => {
      shootEnemy(enemy3, 1);
    }, "500");
  }

  if (type === 4) {
    spawn(enemy4, OFF_SCREEN_RIGHT, HEIGHT, 20);
    setTimeout(() => {
      shootEnemy(enemy4, 1);
    }, "500");
  }

  if (type === 5) {
    spawn(enemy5, randomPosition, GROUND_ENEMY_POSITION, OFF_SCREEN_TOP);
    setTimeout(() => {
      shootEnemy(enemy5, 2);
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
      enemy2.translateX(randomSpeed);
    }
    if (type === 3) {
      enemy3.translateX(randomSpeed);
      enemy3.translateZ(randomSpeed);
    }
    if (type === 4) {
      enemy4.translateZ(randomSpeed);
      enemy4.translateX(randomSpeed);
      enemy4.rotateY(degreesToRadians(0.25));
    }
    if (type === 5) {
      enemy5.translateZ(GROUND_ENEMY_SPEED);
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
  var sphereGeometry;
  if(type === 2)
  sphereGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2.0, 25);
  else  
  sphereGeometry = new THREE.SphereGeometry(0.6, 16, 8);
  var sphereMaterial = new THREE.MeshLambertMaterial({ color: "#FEFE00" });
  var enemyProjectile = new THREE.Mesh(sphereGeometry, sphereMaterial);
  enemyProjectile.alive = true;
  enemyProjectile.castShadow = true;
  projectileEnemies.push(enemyProjectile);
  enemyProjectile.position.set(
    object.position.x,
    object.position.y,
    object.position.z + 3
  );
  let projectileDestination = new THREE.Vector3(
    player.position.x,
    player.position.y,
    player.position.z 
  );
  enemyProjectile.lookAt(projectileDestination);
  scene.add(enemyProjectile);
  if (type === 2) {
    enemyProjectile.rotateX(degreesToRadians(90))
     setInterval(() => {
       if (enemyProjectile.position.y <= HEIGHT) {
        enemyProjectile.translateY(0.1);
       }
     }, "5");
   }
  // every 10 ms checks if the projectileEnemy hit any object or exit the screen
  setInterval(() => {
    if (enemyProjectile.position.y >= HEIGHT ) {
      enemyProjectile.translateZ(ENEMY_PROJECTILE_SPEED);
    }
   
    // remove the projectile if exits the screen
    if (
     enemyProjectile.position.z <= OFF_SCREEN_BOTTOM ||
     enemyProjectile.position.z >= OFF_SCREEN_TOP ||
     enemyProjectile.position.x <= OFF_SCREEN_LEFT ||
     enemyProjectile.position.x >= OFF_SCREEN_RIGHT 
    ) {
      scene.remove(enemyProjectile);
      projectileEnemies = projectileEnemies.filter(
        (p) => p.id !==enemyProjectile.id
      );
      return;
    }

    // check if the projectile hit any object, remove the object
    // and the projectile if did hit
    if (
      detectCollision(playerGeometry, enemyProjectile) &&
      enemyProjectile.alive
    ) {
      if (!GOD_MODE) {
      if(type === 1){
      increasePlayerLife(-1);
      removeHearts(1);
       }else{
        increasePlayerLife(-2);
        removeHearts(2);
       }
      }
      enemyProjectile.alive = false;
      scene.remove(enemyProjectile);
      enemyProjectile.position.set(0, 0, OFF_SCREEN_BOTTOM);
      shrink(playerGeometry);
      grow(playerGeometry);
      // wait 200ms before removing the object so that the animation can play
    }
  }, "10");
  return;
}
