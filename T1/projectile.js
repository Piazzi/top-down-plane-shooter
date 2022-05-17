import * as THREE from "three";
// create a cube
var sphereGeometry = new THREE.SphereGeometry(1.2, 32, 16);
var sphereMaterial = new THREE.MeshLambertMaterial();
const projectile = new THREE.Mesh(sphereGeometry, sphereMaterial);
// position the cube
export default projectile;
// add the cube to the scene
