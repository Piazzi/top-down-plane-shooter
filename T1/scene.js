import * as THREE from  'three';
import {initRenderer, 
        initCamera, 
        initDefaultBasicLight,
        InfoBox,
        createGroundPlaneWired,
        onWindowResize,
        } from "../libs/util/util.js";
import {keyboardUpdate, cone} from './player.js'

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 45, -30)); // Init camera in this position
initDefaultBasicLight(scene);

// Show text information onscreen
showInformation();


// create the ground plane
let plane = createGroundPlaneWired(125, 90, 10, 10);
let plane2 = createGroundPlaneWired(125, 90, 10, 10);
scene.add(plane);

scene.add(cone);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();


function movePlane(){
  scene.add(plane)
  plane.translateY(0.1)
  if(plane.position.z < -45){
      plane.position.set(0,0,45)
  }
}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Press WASD keys to move");
    controls.add("Press SPACE to put the cone in its original position");
    controls.show();
}

function render()
{
  requestAnimationFrame(render); // Show events
  movePlane()
  keyboardUpdate();
  renderer.render(scene, camera) // Render scene
}
