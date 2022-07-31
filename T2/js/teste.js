import * as THREE from "three";
import Stats from "../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  InfoBox,
  onWindowResize,
  createGroundPlaneXZ,
} from "../libs/util/util.js";
import { CSG } from "../../libs/other/CSGMesh.js";
var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
initDefaultBasicLight(scene);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(20, 20);
scene.add(plane);
let cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 32));
let corte = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 32));
corte.rotateZ(degreesToRadians(90));
corte.rotateX(degreesToRadians(90));
let cylinderCSG = CSG.fromMesh(cylinderMesh);
let corteCSG = CSG.fromMesh(corte);
let objeto = cylinderCSG.subtract(corteCSG);
let healthpack = CSG.toMesh(
  objeto,
  new THREE.MeshPhongMaterial({
    color: "darkred", // Main color of the object
    shininess: "0", // Shininess of the object
    specular: "rgb(255,255,255)", // Color of the specular component
  })
);
scene.add(final);
// Use this to show information onscreen
var controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

render();
function render() {
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}
