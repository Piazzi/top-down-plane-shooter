import * as THREE from  'three';



// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshNormalMaterial();
export const enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
// position the cube
enemy.position.set(10.0, 2.0, 30);
// add the cube to the scene

export const lerpConfig = {
    destination: new THREE.Vector3(-10.0, 0.2, -20),
    alpha: 0.01,
    move: true
  }


