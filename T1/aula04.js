import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {initRenderer, 
        initCamera, 
        initDefaultBasicLight,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,
        createGroundPlaneWired} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils

// Main camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0, 0, 1);
  camera.up.set( 0, 1, 0 );

var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
initDefaultBasicLight(scene);
scene.add(cameraHolder)
var clock = new THREE.Clock();

// Show text information onscreen
showInformation();

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneWired(5000, 5000)
scene.add(plane);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();

function keyboardUpdate() {

  keyboard.update();

  const speed = 3;
  const rSpeed = 0.03;

  // Keyboard.pressed - execute while is pressed
  if ( keyboard.pressed("D") )  cameraHolder.rotateZ( -rSpeed );
  if ( keyboard.pressed("A") )  cameraHolder.rotateZ(  rSpeed );
  if ( keyboard.pressed("up") )  cameraHolder.rotateX(  rSpeed );
  if ( keyboard.pressed("down") )  cameraHolder.rotateX(  -rSpeed );
  if ( keyboard.pressed("right") )  cameraHolder.rotateY(  -rSpeed );
  if ( keyboard.pressed("left") )  cameraHolder.rotateY(  rSpeed );
  if ( keyboard.pressed("W") )  cameraHolder.translateZ(  -speed );
  if ( keyboard.pressed("S") )  cameraHolder.translateZ( speed );

  if ( keyboard.pressed("space") ) camera.position.set(0.0, 2.0, 0.0);
}
// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement );

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Keyboard Example");
    controls.addParagraph();
    controls.add("Press WASD keys to move continuously");
    controls.add("Press arrow keys to move in discrete steps");
    controls.add("Press SPACE to put the camera in its original position");
    controls.show();
}

function render()
{
  requestAnimationFrame(render); // Show events
  keyboardUpdate();
  renderer.render(scene, camera) // Render scene
}
