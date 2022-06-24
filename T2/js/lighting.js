import * as THREE from "three";

export const lightPosition = new THREE.Vector3(0, 30.0, 30.0);
const lightColor = "rgb(250,255,255)";
const ambientColor = "rgb(50,50,50)";
export const ambientLight = new THREE.AmbientLight(ambientColor);
export const dirLight = new THREE.DirectionalLight(lightColor);

dirLight.position.copy(lightPosition);
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.castShadow = true;
dirLight.shadow.camera.near = 15;
dirLight.shadow.camera.far = 60;
dirLight.shadow.camera.left = -40;
dirLight.shadow.camera.right = 40;
dirLight.shadow.camera.top = 60;
dirLight.shadow.camera.bottom = -60;
dirLight.lightIntensity = 1.0;
dirLight.decay = 0.5;
dirLight.penumbra = 1.0;
dirLight.shadow.bias = -0.0005;  
// No effect on Basic and PCFSoft
dirLight.shadow.radius = 3;
