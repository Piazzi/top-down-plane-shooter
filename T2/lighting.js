import * as THREE from "three";

export const lightPosition = new THREE.Vector3(0, 30.0, 10.1);
const lightColor = "rgb(255,255,255)";
const ambientColor = "rgb(50,50,50)";
export const ambientLight = new THREE.AmbientLight(ambientColor);
export const dirLight = new THREE.DirectionalLight(lightColor);

dirLight.position.copy(lightPosition);
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.castShadow = true;
dirLight.shadow.camera.near = 10;
dirLight.shadow.camera.far = 40;
dirLight.shadow.camera.left = -40;
dirLight.shadow.camera.right = 40;
dirLight.shadow.camera.top = 30;
dirLight.shadow.camera.bottom = -30;
dirLight.lightIntensity = 1.0;
dirLight.decay = 2;
dirLight.penumbra = 0.5;
dirLight.shadow.bias = -0.0005;  
// No effect on Basic and PCFSoft
dirLight.shadow.radius = 4;
