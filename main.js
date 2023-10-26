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
camera.position.set(0, 3, 10);

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

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.zoomSpeed = 7;
// controls.dynamicDampingFactor = 0.1;
// controls.update();

//FLOOR GEO
const floorGeo = new THREE.BoxGeometry(20, 0.1, 20);
const floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.userData.ground = true;
floor.name = 'ground';
scene.add(floor);

//BOX GEO

const sceneElements = [];

const loader = new GLTFLoader();

loader.load(
  'assets/cube-with-slider.glb',
  function (gltf) {
    gltf.scene.userData.draggable = true;
    gltf.scene.children[0].material.color.setHex(0x818181);
    gltf.scene.children[1].material.color.setHex(0x818181);

    sceneElements.push(gltf.scene);
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
draggable = null;
let intersected;

window.addEventListener('click', (event) => {
  // if (draggable) {
  //   console.log(`dropping ${draggable.children[0].name}`);
  //   draggable.children[0].material.color.setHex(0x818181);
  //   draggable.children[1].material.color.setHex(0x818181);
  //   window.removeEventListener('keydown', moveBlock);

  //   draggable = null;
  //   return;
  // }
  clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(clickMouse, camera);
  intersected = raycaster.intersectObjects(sceneElements);

  if (intersected.length > 0 && intersected[0].object.name === 'box') {
    draggable = intersected[0].object.parent;
    draggable.children[0].material.color.setHex(0xff0000);
    draggable.children[1].material.color.setHex(0x00ff00);
    console.log(`found draggable ${draggable.children[0].name}`);
  }

  if (draggable != null) {
    window.addEventListener('keydown', moveBlock);
    window.addEventListener('click', () => {
      console.log('here');
    });
  }
});

function moveFader(event) {
  mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseMove.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // draggable.children[1].position.z = mouseMove.x;

  // if (draggable.children[1].position.z < -0.6) {
  //   draggable.children[1].position.z = -0.6;
  // }
  // if (draggable.children[1].position.z > 0.6) {
  //   draggable.children[1].position.z = 0.6;
  // }
}

function moveBlock(e) {
  switch (e.key) {
    case 'w':
      draggable.position.z -= 0.5;
      break;
    case 's':
      draggable.position.z += 0.5;
      break;
    case 'a':
      draggable.position.x -= 0.5;
      break;
    case 'd':
      draggable.position.x += 0.5;
      break;
    case 'r':
      draggable.position.y += 0.5;
      break;
    case 'f':
      draggable.position.y -= 0.5;
      break;
  }
}

//ANIMATE
function animate() {
  requestAnimationFrame(animate);
  // controls.update();
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
