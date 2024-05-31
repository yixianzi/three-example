<script setup>
import * as THREE from "three";
import gsap from "gsap";
import {
  OrbitControls,
  DRACOLoader,
  GLTFLoader,
  RGBELoader,
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
  scene.add(gridHelper);

  // LOADER
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load("./model/car.glb", (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        console.log(child.name);
      }

      // 这里就只演示车身、烟囱，其他略
      if (child.name.includes("body") || child.name.includes("brake")) {
        child.material = carBodyMaterial;
        car.value = child;
      }

      if (child.isMesh && child.name.includes("glass")) {
        child.material = carGlassMaterial;
      }
    });
    console.log(gltf);
    scene.add(model);
  });

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
  name: "Car",
};
</script>
<template>
  <div class="home">
    <div class="canvas-containe" ref="canvasDom"></div>
    <div class="action">
      <h1>选择颜色</h1>
      <el-color-picker v-model="color1" @change="setColor" />
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.home {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.action {
  position: absolute;
  z-index: 99;
  width: 300px;
  top: 100px;
  right: 100px;
}
</style>
