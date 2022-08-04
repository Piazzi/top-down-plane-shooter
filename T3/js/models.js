import { OBJLoader } from "/build/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/build/jsm/loaders/MTLLoader.js";
import { HEIGHT } from "./config.js";
import { degreesToRadians } from "../../libs/util/util.js";
import { scene } from "./scene.js";
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
    boat.scale.set(0.1, 0.1, 0.1);
    boat.rotateY(degreesToRadians(90));
    boat.position.set(0.0, 0.0, 0.0);
    // tankGeometry.material[0].shininess = 200;
    // tankGeometry.material[0].specular.r = "255";
    // tankGeometry.material[0].specular.g = "255";
    // tankGeometry.material[0].specular.b = "255";
    // console.log(tank.children[0]);
    // scene.add(boat);
    boat.alive = true;
  });
});

export let missile = undefined;
export let missileGeometry = undefined;
mtlLoader.load("./materials/rocket.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/rocket.obj", (object) => {
    missile = object;
    missile.children[0].castShadow = true;
    missile.children[0].receiveShadow = true;
    missile.children[0].visible = true;
    missileGeometry = missile.children[0];
    missile.scale.set(0.5, 0.5, 0.5);
    missileGeometry.rotateY(degreesToRadians(90));
    missile.position.set(0.0, HEIGHT, 0.0);
    // scene.add(missile);
    // console.log(tank.children[0]);
    missile.alive = true;
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
    // plane.rotateY(degreesToRadians(180));
    plane.scale.set(0.15, 0.15, 0.15);
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
    playerProjectileGeometry.rotateX(degreesToRadians(90));
    playerProjectile.scale.set(0.5, 0.5, 0.5);
    playerProjectile.position.set(0.0, HEIGHT, 0.0);
    // scene.add(pencil);
    // console.log(tank.children[0]);
    playerProjectile.alive = true;
  });
});
