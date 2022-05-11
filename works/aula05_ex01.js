import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    createGroundPlaneXZ,
    onWindowResize
} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 40)");
var camera = initCamera(new THREE.Vector3(5, 15, 30)); // Init camera in this position
initDefaultBasicLight(scene, true, new THREE.Vector3(25, 30, 20))

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

var groundPlane = createGroundPlaneXZ(50, 50); // width and height
scene.add(groundPlane);

// Variables that will be used for linear interpolation
const lerpConfig = {
    destination: new THREE.Vector3(10.0,3,10.0,0.001),
    alpha: 0.01,
    move: true
  }

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(12);
axesHelper.visible = false;
scene.add(axesHelper);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// Object Material for all objects
var objectMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255,20,20)", shininess: "200" });

// Add objects to scene
let sphere1 = createSphere(3.0, 20, 20);
let sphere2 = createSphere(3.0, 20, 20);

scene.add(sphere1);
scene.add(sphere2);

sphere2.position.set(-20.0, 3, -20.0);
sphere1.position.set(-20.0, 3, 20.0);


buildInterface();
render();

function createSphere(radius, widthSegments, heightSegments) {
    var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
    var object = new THREE.Mesh(geometry, objectMaterial);
    object.castShadow = true;
    object.position.set(0.0, radius, 0.0);
    return object;
}



function buildInterface() {
    // Interface
    var controls = new function () {
        
        this.esfera1 = function () {
            goRight(sphere1);
        };

        this.esfera2 = function () {
            goRight(sphere2);
        };

        this.reset = function () {
            sphere2.position.set(-20.0, 3, -20.0);
            sphere1.position.set(-20.0, 3, 20.0);
        };


    };

    // GUI interface
    var gui = new GUI();
   
    gui.add(controls, 'esfera1', true).name("Esfera 1");
    gui.add(controls, 'esfera2', true).name("Esfera 2");
    gui.add(controls, 'reset', true).name("Reset");
}

function goRight(sphere) {
    if(lerpConfig.move) {
        sphere.position.lerp(lerpConfig.destination, lerpConfig.alpha)
    };
}

function render() {

    stats.update(); // Update FPS
    trackballControls.update();
    requestAnimationFrame(render); // Show events
    renderer.render(scene, camera) // Render scene
}