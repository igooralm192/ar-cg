// import * as THREE from '../resources/threejs/build/three.module.js';

import { OrbitControls } from "../resources/threejs/examples/jsm/controls/OrbitControls.js";

var renderer;
var scene;
var camera;
var source;
var controllerAR;

async function initializeAR(marker) {
  controllerAR = await THREEAR.initialize({ source });

  var patternMarker = new THREEAR.PatternMarker({
    patternUrl: "./patt.hiro",
    markerObject: marker,
  });

  controllerAR.trackMarker(patternMarker);
}

function animateFrame(callback) {
  // run the rendering loop
  var lastTimeMsec = 0;
  requestAnimationFrame(function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);

		callback(lastTimeMsec, nowMsec)
  });
}

async function main() {
	renderer = new THREE.WebGLRenderer({
		// antialias	: true,
		alpha: true,
	});
	renderer.setClearColor(new THREE.Color("lightgrey"), 0);
	// renderer.setPixelRatio( 2 );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = "absolute";
	renderer.domElement.style.top = "0px";
	renderer.domElement.style.left = "0px";
	document.body.appendChild(renderer.domElement);
	
	// init scene and camera
	scene = new THREE.Scene();
	camera = new THREE.Camera();
	scene.add(camera);
	
	source = new THREEAR.Source({ renderer, camera });
	
	var markerGroup = new THREE.Group();
	scene.add(markerGroup);
	
	// add a torus knot
	var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
	var material = new THREE.MeshNormalMaterial();
	var torus = new THREE.Mesh(geometry, material);
	torus.position.y = 0.5;
	markerGroup.add(torus);
	
	var geometry = new THREE.CubeGeometry(1, 1, 1);
	var material = new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide,
	});
	var cube = new THREE.Mesh(geometry, material);
	cube.position.y = geometry.parameters.height / 2;
	markerGroup.add(cube);

	await initializeAR(markerGroup)
	
	animateFrame((lastTimeMsec, nowMsec) => {
		// measure time
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    // call each update function
    controllerAR.update(source.domElement);
    // cube.rotation.x += deltaMsec/10000 * Math.PI
    torus.rotation.y += (deltaMsec / 1000) * Math.PI;
    torus.rotation.z += (deltaMsec / 1000) * Math.PI;
    renderer.render(scene, camera);
	})
}


main()