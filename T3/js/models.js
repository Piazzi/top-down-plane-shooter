import { OBJLoader } from "/build/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/build/jsm/loaders/MTLLoader.js";
import { HEIGHT } from "./config.js";
import { degreesToRadians } from "../../libs/util/util.js";
//importing 3D model airplane player
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();
export let boat = undefined;
export let boatGeometry = undefined;
mtlLoader.load("./materials/boat.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/boat.obj", (object) => {
    boat = object;
    boat.children[0].castShadow = true;
    boat.children[0].receiveShadow = true;
    boat.children[0].visible = true;
    boatGeometry = boat.children[0];
    boat.scale.set(1, 1, 1);
    boat.rotateY(degreesToRadians(180));
    boat.position.set(0.0, 0.0, 0.0);
    // tankGeometry.material[0].shininess = 200;
    // tankGeometry.material[0].specular.r = "255";
    // tankGeometry.material[0].specular.g = "255";
    // tankGeometry.material[0].specular.b = "255";
    // console.log(tank.children[0]);
    boat.alive = true;
  });
});

export let projectile = undefined;
export let projectileGeometry = undefined;
mtlLoader.load("./materials/rocket.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/rocket.obj", (object) => {
    projectile = object;
    projectile.children[0].castShadow = true;
    projectile.children[0].receiveShadow = true;
    projectile.children[0].visible = true;
    projectileGeometry = projectile.children[0];
    projectile.scale.set(2, 2, 2);
    projectile.rotateY(degreesToRadians(180));
    projectile.position.set(0.0, HEIGHT, 0.0);
    // scene.add(clip);
    // console.log(tank.children[0]);
    projectile.alive = true;
  });
});

export let plane = undefined;
export let planeGeometry = undefined;
mtlLoader.load("./materials/player_plane.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/player_plane.obj", (object) => {
    plane = object;
    plane.children[0].castShadow = true;
    plane.children[0].receiveShadow = true;
    plane.children[0].visible = true;
    planeGeometry = plane.children[0];
    plane.rotateY(degreesToRadians(180));
    plane.scale.set(0.65, 0.65, 0.65);
    plane.position.set(0.0, HEIGHT, 0.0);
    // scene.add(plane);
    // console.log(tank.children[0]);
    plane.alive = true;
  });
});

export let playerProjectile = undefined;
export let playerProjectileGeometry = undefined;
mtlLoader.load("./materials/rocket.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/rocket.obj", (object) => {
    playerProjectile = object;
    playerProjectile.children[0].castShadow = true;
    playerProjectile.children[0].receiveShadow = true;
    playerProjectile.children[0].visible = true;
    playerProjectileGeometry = playerProjectile.children[0];
    // pencilGeometry.rotateX(degreesToRadians(-90));
    playerProjectile.scale.set(24, 24, 24);
    playerProjectile.position.set(0.0, HEIGHT, 0.0);
    // scene.add(pencil);
    // console.log(tank.children[0]);
    playerProjectile.alive = true;
  });
});
