import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import {initRenderer, 
        initCamera, 
        initDefaultBasicLight,
        InfoBox,
        createGroundPlaneWired,
        onWindowResize,
        } from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 30, -30)); // Init camera in this position
initDefaultBasicLight(scene);
var clock = new THREE.Clock();

// Show text information onscreen
showInformation();

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneWired(120, 90, 10, 10);
scene.add(plane);

// create a cone
const geometry = new THREE.ConeGeometry( 2, 10, 16 );
const material = new THREE.MeshBasicMaterial( {color: 0xfeaa00} );
const cone = new THREE.Mesh( geometry, material );
cone.rotation.set(0,0,0);

// position the cube
cone.position.set(0.0, 2.0, 0.0);
// add the cube to the scene
scene.add(cone);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();

function keyboardUpdate() {

  keyboard.update();

  var speed = 30;
  var moveDistance = speed * clock.getDelta();

  // Keyboard.pressed - execute while is pressed
  if ( keyboard.pressed("A") )  cone.translateX( moveDistance );
  if ( keyboard.pressed("D") )  cone.translateX(  -moveDistance );
  if ( keyboard.pressed("W") )  cone.translateZ(  moveDistance );
  if ( keyboard.pressed("S") )  cone.translateZ( -moveDistance );
  if ( keyboard.pressed("space") ) cone.position.set(0.0, 2.0, 0.0);
}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Keyboard Example");
    controls.addParagraph();
    controls.add("Press WASD keys to move");
    controls.add("Press SPACE to put the cone in its original position");
    controls.show();
}

function render()
{
  requestAnimationFrame(render); // Show events
  keyboardUpdate();
  renderer.render(scene, camera) // Render scene
}
