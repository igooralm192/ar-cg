import * as THREE from '../resources/threejs/build/three.module.js';

import { OrbitControls } from '../resources/threejs/examples/jsm/controls/OrbitControls.js';

let camera, controls, renderer, raycaster;
let mouse = new THREE.Vector2();
var scene = null

init();
animate();

function onMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(400, 200, 0);

    createControls();

    /* Esse código gera o cubo para testar a iluminação, pode retirar */
    const mat = new THREE.MeshPhongMaterial({
        color: '0x000000'
    })

    const geometry = new THREE.BoxGeometry(7, 7, 7)

    const mesh = new THREE.Mesh(geometry, mat)
    mesh.name = "testmesh"

    mesh.position.set(0, 30, 50)

    scene.add(mesh)

    /****************************************************/

    generateSun();

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove, false);
}

function createControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.keyPanSpeed = 30;

    controls.minDistance = 100;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI / 2;
}

function generateSun() {
    const sunMaterial = new THREE.MeshBasicMaterial(
        {
            color: '0xffffff'
        }
    );

    const sunGeometry = new THREE.SphereGeometry(16, 48, 48);

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.castShadow = false;

    const sunLight = new THREE.PointLight(0xffdcb4, 1.5);

    var spriteMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.ImageUtils.loadTexture("../resources/Images/glow.png"),
            useScreenCoordinates: false,
            color: 0xffffee,
            transparent: false,
            blending: THREE.AdditiveBlending
        });

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(70, 70, 1.0);
    sun.add(sprite);

    sun.name = "sun";
    sun.add(sunLight);

    scene.add(sun);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate(time) {

    const sunRot = 0.005

    var obj

    obj = scene.getObjectByName("sun")

    obj.rotateY(sunRot)

    requestAnimationFrame(animate);

    controls.update();

    render();

}

function render() {

    raycaster.setFromCamera( mouse, camera );

    renderer.render(scene, camera);

}
