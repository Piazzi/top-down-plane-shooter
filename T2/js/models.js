import { OBJLoader } from "/build/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/build/jsm/loaders/MTLLoader.js";
import { HEIGHT } from "./config.js";
import { scene } from "./scene.js";
import { degreesToRadians } from "../../libs/util/util.js";
//importing 3D model airplane player
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();
export let tank = undefined;
export let tankGeometry = undefined;
mtlLoader.load("./materials/paper_plane.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/tank.obj", (object) => {
    tank = object;
    tank.children[0].castShadow = true;
    tank.children[0].receiveShadow = true;
    tank.children[0].visible = true;
    tankGeometry = tank.children[0];
    tank.scale.set(1, 1, 1);
    tank.rotateY(degreesToRadians(180));
    tank.position.set(0.0, HEIGHT, 0.0);
    // tankGeometry.material[0].shininess = 200;
    // tankGeometry.material[0].specular.r = "255";
    // tankGeometry.material[0].specular.g = "255";
    // tankGeometry.material[0].specular.b = "255";
    // console.log(tank.children[0]);
    tank.alive = true;
  });
});

export let clip = undefined;
export let clipGeometry = undefined;
mtlLoader.load("./materials/paper_clip.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/paper_clip.obj", (object) => {
    clip = object;
    clip.children[0].castShadow = true;
    clip.children[0].receiveShadow = true;
    clip.children[0].visible = true;
    clipGeometry = clip.children[0];
    clip.scale.set(2, 2, 2);
    clip.rotateY(degreesToRadians(180));
    clip.position.set(0.0, HEIGHT, 0.0);
    // scene.add(clip);
    // console.log(tank.children[0]);
    clip.alive = true;
  });
});

export let plane = undefined;
export let planeGeometry = undefined;
mtlLoader.load("./materials/eraser.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/ww2.obj", (object) => {
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

export let plane2 = undefined;
export let plane2Geometry = undefined;
mtlLoader.load("./materials/paper_plane.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/14bis.obj", (object) => {
    plane2 = object;
    plane2.children[0].castShadow = true;
    plane2.children[0].receiveShadow = true;
    plane2.children[0].visible = true;
    plane2Geometry = plane2.children[0];
    plane2Geometry.rotateY(degreesToRadians(-90));
    plane2.scale.set(1, 1, 1);
    plane2.position.set(0.0, HEIGHT, 0.0);
    // scene.add(plane2);
    // console.log(tank.children[0]);
    plane2.alive = true;
  });
});
export let plane3 = undefined;
export let plane3Geometry = undefined;
mtlLoader.load("./materials/paper_plane.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/avion.obj", (object) => {
    plane3 = object;
    // plane3.children[0].castShadow = true;
    // plane3.children[0].receiveShadow = true;
    plane3.children[0].visible = true;
    plane3Geometry = plane3.children[0];
    // plane3.rotateY(degreesToRadians(-45));
    plane3.scale.set(1, 1, 1);
    plane3.position.set(0.0, HEIGHT, 0.0);
    // scene.add(plane3);
    // console.log(tank.children[0]);
    plane3.alive = true;
  });
});

export let pencil = undefined;
export let pencilGeometry = undefined;
mtlLoader.load("./materials/eraser.mtl", (materials) => {
  materials.preload();

  objLoader.setMaterials(materials);
  objLoader.load("./assets/eraser.obj", (object) => {
    pencil = object;
    pencil.children[0].castShadow = true;
    pencil.children[0].receiveShadow = true;
    pencil.children[0].visible = true;
    pencilGeometry = pencil.children[0];
    // pencilGeometry.rotateX(degreesToRadians(-90));
    pencil.scale.set(24, 24, 24);
    pencil.position.set(0.0, HEIGHT, 0.0);
    // scene.add(pencil);
    // console.log(tank.children[0]);
    pencil.alive = true;
  });
});
