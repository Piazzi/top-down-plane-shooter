import * as THREE from "three";
import {
  initCamera,
  createGroundPlaneWired,
  onWindowResize,
  createLightSphere,
} from "../../libs/util/util.js";

import { healthpacks } from "./healthpack.js";
import { keyboardUpdate, player, projectiles } from "./player.js";
import {
  ENEMY_1_INTERVAL_HANDLER,
  ENEMY_1_TIMEOUT_HANDLER,
  ENEMY_2_INTERVAL_HANDLER,
  ENEMY_2_TIMEOUT_HANDLER,
  ENEMY_3_INTERVAL_HANDLER,
  ENEMY_3_TIMEOUT_HANDLER,
  ENEMY_4_INTERVAL_HANDLER,
  ENEMY_4_TIMEOUT_HANDLER,
  HEALTHPACK_INTERVAL_HANDLER,
  HEALTHPACK_TIMEOUT_HANDLER,
  HEIGHT,
  PLANE_SPEED,
  resetTimeouts,
} from "./config.js";

import { enemies, projectileEnemies } from "./enemy.js";
import { dirLight, ambientLight, lightPosition } from "./lighting.js";
import { stats, resetHearts, clock, resetGameMessage } from "./interface.js";
import { Water } from '/build/jsm/objects/Water.js';  

export var scene = new THREE.Scene(); // Create main scene

// Set all renderers
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0xf2e394, 0.5); // second param is opacity, 0 => transparent

document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // default

var camera = initCamera(new THREE.Vector3(0, 45, -30)); // Init camera in this position
createLightSphere(scene, 0.5, 10, 10, lightPosition);

const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const themeSound = new THREE.Audio( listener );
export const explosionSound = new THREE.Audio( listener );
export const playerMissileSound = new THREE.Audio( listener );
export const enemyMissileSound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const themeAudioLoader = new THREE.AudioLoader();
themeAudioLoader.load( 'sounds/theme.mp3', function( buffer ) {
	themeSound.setBuffer( buffer );
	themeSound.setLoop( true );
	themeSound.setVolume( 0.2 );
	themeSound.play();
});

 const explosionAudioLoader = new THREE.AudioLoader();
explosionAudioLoader.load( 'sounds/explosion.wav', function( buffer ) {
	explosionSound.setBuffer( buffer );
	explosionSound.setVolume( 0.2 );
});

 const playerMissileAudioLoader = new THREE.AudioLoader();
playerMissileAudioLoader.load( 'sounds/missile1.wav', function( buffer ) {
	playerMissileSound.setBuffer( buffer );
	playerMissileSound.setVolume( 0.2 );
  playerMissileSound.duration(0.5);
});

 const enemyMissileAudioLoader = new THREE.AudioLoader();
enemyMissileAudioLoader.load( 'sounds/missile2.wav', function( buffer ) {
	enemyMissileSound.setBuffer( buffer );
	enemyMissileSound.setVolume( 0.2 );
});


// create the ground plane
const environment = new THREE.TextureLoader();
let textureEquirec = environment.load( '../assets/textures/panorama5.jpg' );
	textureEquirec.mapping = THREE.EquirectangularReflectionMapping; 
	textureEquirec.encoding = THREE.sRGBEncoding;
scene.background = textureEquirec

const waterGeometry = new THREE.PlaneGeometry( 50, 200 );
// Water shader parameters
let water = new Water(
  waterGeometry,
  {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( '../assets/textures/waternormals.jpg', function ( texture ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    } ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f, 
    distortionScale: 3.7,
  }
);
water.rotation.x = - Math.PI / 2;

let water2 = new Water(
  waterGeometry,
  {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( '../assets/textures/waternormals.jpg', function ( texture ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    } ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f, 
    distortionScale: 3.7,
  }
);
water2.rotation.x = - Math.PI / 2;

const waterUniforms = water.material.uniforms;
waterUniforms.distortionScale, 'value', 0, 8, 0.1 ;
waterUniforms.size, 'value', 0.1, 10, 0.1;

water.position.set(0, 0, 0);
water.receiveShadow = true;

water2.position.set(0, 0, 200);
water2.receiveShadow = true;

var textureLoader = new THREE.TextureLoader();

/*let plane = createGroundPlaneWired(125, 200, 1, 1, "#F2E394");
plane.position.set(0, 0, 0);
plane.receiveShadow = true;

let plane2 = createGroundPlaneWired(125, 200, 1, 1, "#F2E394");
plane2.position.set(0, 0, 200);
plane2.receiveShadow = true;

var textureLoader = new THREE.TextureLoader();
var paper = textureLoader.load("./images/paper.jpg");

// Add texture to the 'map' property of the object's material
plane.material.map = paper;
plane2.material.map = paper;*/

// adds the player to the scene
scene.add(dirLight);
scene.add(ambientLight);
//scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

render();

// move the plane against the player to simulate movement
function movePlane() {
  scene.add(water);
  scene.add(water2);
  water.translateY(PLANE_SPEED);
  water2.translateY(PLANE_SPEED);

  if (water2.position.z < 0 && water2.position.z > -0.1) {
    water.position.z = 200;
  } 
  
  if (water.position.z < 0 && water.position.z > -0.1) {
    water2.position.z = 200;
  }
}

// resets the game removing all active
// enemies, projectiles and setting the players position

export function resetGame() {
  enemies.forEach((e) => {
    scene.remove(e);
  });

  healthpacks.forEach((e) => {
    scene.remove(e);
  });

  projectileEnemies.forEach((e) => {
    scene.remove(e);
  });

  projectiles.length = 0;
  enemies.length = 0;
  player.position.set(0.0, HEIGHT, 0.0);

  resetHearts();
  clock.start();
  resetGameMessage.style.visibility = "visible";
  setTimeout(() => {
    resetGameMessage.style.visibility = "hidden";
  }, 3000);

  clearTimeout(ENEMY_1_TIMEOUT_HANDLER);
  clearTimeout(ENEMY_2_TIMEOUT_HANDLER);
  clearTimeout(ENEMY_3_TIMEOUT_HANDLER);
  clearTimeout(ENEMY_4_TIMEOUT_HANDLER);
  clearTimeout(HEALTHPACK_TIMEOUT_HANDLER);
  clearInterval(HEALTHPACK_INTERVAL_HANDLER);
  clearInterval(ENEMY_1_INTERVAL_HANDLER);
  clearInterval(ENEMY_2_INTERVAL_HANDLER);
  clearInterval(ENEMY_3_INTERVAL_HANDLER);
  clearInterval(ENEMY_4_INTERVAL_HANDLER);
  resetTimeouts();
}

function render() {
  requestAnimationFrame(render); // Show events
   water.material.uniforms[ 'time' ].value += 0.01;
  movePlane();
  keyboardUpdate();
  renderer.render(scene, camera); // Render scene
  stats.update();
}
