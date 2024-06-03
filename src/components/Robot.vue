<script setup>
import * as THREE from "three";
import gsap from "gsap";
import {
  OrbitControls,
  DRACOLoader,
  GLTFLoader,
  RGBELoader,
  Reflector,
} from "three/examples/jsm/Addons.js";
import { ref, onMounted, reactive } from "vue";
const color1 = ref("#409EFF");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 6);
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();
}

const carBodyMaterial = new THREE.MeshPhysicalMaterial({
  color: color1.value, // 颜色
  metalness: 1, // 金属色
  roughness: 0.3, // 粗糙度
  clearcoat: 1, // 薄膜（用于模拟油漆）
  clearcoatRoughness: 0, //薄膜粗糙度
});

const carGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: "0xffffff",
  metalness: 0.25,
  roughness: 0,
  transmission: 1.0, // 透光率
});

const canvasDom = ref(null);
const car = ref();
const setColor = (color) => {
  // car.value.material.color.set(new THREE.Color(color));
  carBodyMaterial.color.set(new THREE.Color(color));
};
onMounted(() => {
  canvasDom.value.appendChild(renderer.domElement);

  renderer.setClearColor("#000");
  scene.background = new THREE.Color("#ccc");
  scene.environment = new THREE.Color("#ccc");
  render();

  // 网格地面
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  // scene.add(gridHelper);

  const hdrLoader = new RGBELoader();
  hdrLoader.load("./assets/sky12.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });

  // LOADER
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load("./model/robot.glb", (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 0.2, 0);
    scene.add(model);
  });

  const video = document.createElement("video");
  video.src = "./assets/zp2.mp4";
  video.loop = true;
  video.muted = true;
  video.play();

  const videoTexture = new THREE.VideoTexture(video);
  const videoGeoPlane = new THREE.PlaneGeometry(16, 9);
  const videoMeterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaMap: videoTexture,
  });
  const videoMesh = new THREE.Mesh(videoGeoPlane, videoMeterial);
  videoMesh.position.set(0, 0.2, 0);
  videoMesh.rotation.x = -Math.PI / 2;
  scene.add(videoMesh);

  const reflectorGeometry = new THREE.PlaneGeometry(16, 9);
  const reflectPlane = new Reflector(reflectorGeometry, {
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: 0x332222,
  });
  reflectPlane.rotation.x = -Math.PI / 2;
  scene.add(reflectPlane);

  const AxesHelper = new THREE.AxesHelper();
  scene.add(AxesHelper);
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 0, 10);
  scene.add(light);
  const light2 = new THREE.DirectionalLight(0xffffff, 2);
  light2.position.set(0, 0, -10);
  scene.add(light2);
  const light3 = new THREE.DirectionalLight(0xffffff, 2);
  light3.position.set(10, 0, 0);
  scene.add(light3);
  const light4 = new THREE.DirectionalLight(0xffffff, 2);
  light4.position.set(-10, 0, 0);
  scene.add(light4);
  const light5 = new THREE.DirectionalLight(0xffffff, 2);
  light5.position.set(0, 10, 0);
  scene.add(light5);

  const light6 = new THREE.DirectionalLight(0xffffff, 2);
  light6.position.set(-10, 10, 10);
  scene.add(light6);

  const light7 = new THREE.DirectionalLight(0xffffff, 2);
  light7.position.set(10, 10, 10);
  scene.add(light7);

  const light8 = new THREE.DirectionalLight(0xffffff, 2);
  light5.position.set(10, 10, -10);
  scene.add(light8);

  const light9 = new THREE.DirectionalLight(0xffffff, 2);
  light9.position.set(-10, 10, -10);
  scene.add(light9);
});
</script>
<script>
export default {
  name: "Robot",
};
</script>
<template>
  <div class="home">
    <div class="canvas-containe" ref="canvasDom"></div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
