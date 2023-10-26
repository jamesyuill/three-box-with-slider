import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { FlyControls } from 'three/addons/controls/FlyControls.js';
//SCENE & CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x333333, 1);

document.body.appendChild(renderer.domElement);

//LIGHTS
const ambientLight = new THREE.PointLight(0xffffff, 1);
ambientLight.position.set(0, 4, 5);
scene.add(ambientLight);

//CAMERA CONTROLS

// const flyControls = new FlyControls(camera, renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomSpeed = 7;
controls.dynamicDampingFactor = 0.1;
controls.update();

//FLOOR GEO
const floorGeo = new THREE.BoxGeometry(20, 0.1, 20);
const floorMat = new THREE.MeshStandardMaterial();
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.userData.ground = true;
floor.name = 'ground';
scene.add(floor);

//BOX GEO
const loader = new GLTFLoader();

loader.load(
  'assets/cube-with-slider.glb',
  function (gltf) {
    const cube = gltf.scene.children[0];
    cube.userData.draggable = true;

    const fader = gltf.scene.children[1];
    fader.position.z = 0.1;
    fader.userData.draggable = true;
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.rotation.set(0, 1.6, 0);

    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//RAYCASTER
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const mouseMove = new THREE.Vector2();
let draggable = THREE.Object3D;

window.addEventListener('click', (event) => {
  if (draggable) {
    console.log(`dropping ${draggable.name}`);
    draggable = null;
    return;
  }

  clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(clickMouse, camera);
  const intersected = raycaster.intersectObjects(scene.children);
  if (intersected.length > 0 && intersected[0].object.userData.draggable) {
    draggable = intersected[0].object;
    console.log(`found draggable ${draggable.name}`);
  }
});

window.addEventListener('mousemove', (event) => {
  mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseMove.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function dragObject() {
  if (draggable != null) {
    window.addEventListener('keydown', (e) => {
      if (e.keycode === 87) {
        console.log('forward');
      }
    });

    // raycaster.setFromCamera(mouseMove, camera);
    // const intersected = raycaster.intersectObjects(scene.children);
    // if (intersected.length > 0) {
    //   for (let o of intersected) {
    //     // o.object.material.color.setHex(0xff0000);

    //     if (o.object.name === 'ground') continue;
    //     draggable.position.x = -o.point.z;
    //     draggable.position.z = o.point.x;
    //   }
  }
}

//ANIMATE
function animate() {
  dragObject();
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

//EVENT HANDLER
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
