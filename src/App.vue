<script setup>
import * as THREE from "three";
import gsap from "gsap";
import {
  OrbitControls,
  DRACOLoader,
  GLTFLoader,
  RGBELoader,
  Water2,
} from "three/examples/jsm/Addons.js";
import { ref } from "vue";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-3.23, 2.98, 4.06);
camera.updateWorldMatrix(); // 更新相机投影矩阵

const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.outputColorSpace = THREE.SRGBColorSpace; // 设置输出颜色空间
renderer.toneMapping = THREE.ACESFilmicToneMapping; // 设置色调映射
renderer.toneMappingExposure = 0.5; // 曝光强度
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement); // 相机，画布
// controls.enableDamping = true; // 开启阻尼效果

// LOADER
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("./model/scene.glb", (gltf) => {
  const model = gltf.scene;
  model.traverse((child) => {
    if (child.name === "Plane") {
      child.visible = false;
    }
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(model);
  console.log(model);
});

// 加载环境纹理
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/sky.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 水面效果
const waterGeometry = new THREE.CircleGeometry(300, 32);
const water = new Water2(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1), // 水流方向
  scale: 100, //
});

water.rotation.x = -Math.PI / 2;
water.position.y = -0.4;
scene.add(water);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 50, 0);
scene.add(light);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(0.1, 2.4, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// 创建光球，点光源组
const pointLightGroup = new THREE.Group();
pointLightGroup.position.set(-8, 2.5, -1.5);
let radius = 3;
let pointLightArr = [];
for (let i = 0; i < 3; i++) {
  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 10,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const pointLight = new THREE.PointLight(0xffffff, 50);
  sphere.add(pointLight);
  sphere.name = "qiu";

  sphere.position.set(
    radius * Math.cos((i * 2 * Math.PI) / 3),
    Math.cos((i * 2 * Math.PI) / 3),
    radius * Math.sin((i * 2 * Math.PI) / 3)
  );
  pointLightArr.push(sphere);

  pointLightGroup.add(sphere);
}

scene.add(pointLightGroup);

// 动画
let options = {
  angle: 0,
};
gsap.to(options, {
  angle: Math.PI * 2,
  duration: 10,
  repeat: -1,
  ease: "linear",
  onUpdate: () => {
    pointLightGroup.rotation.y = options.angle;
    pointLightArr.forEach((item, i) => {
      item.position.set(
        radius * Math.cos((i * 2 * Math.PI) / 3),
        Math.cos((i * 2 * Math.PI) / 3 + options.angle * 5),
        radius * Math.sin((i * 2 * Math.PI) / 3)
      );
    });
  },
});

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();
  // pointLightGroup.rotation.y += 0.1;
  // pointLightGroup.traverse((child) => {
  //   if (child.name == "qiu") {
  //     child.position.set(
  //       child.position.x,
  //       Math.cos(pointLightGroup.rotation.y),
  //       child.position.z
  //     );
  //   }
  // });
}
render();

const timeLine1 = gsap.timeline();
const timeLine2 = gsap.timeline();
let ani = false;
function translateCamera(position, target) {
  timeLine1.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1,
    ease: "power1.inOut",
  });
  timeLine2.to(controls.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1,
    ease: "power1.inOut",
    onComplete: () => {
      ani = false;
    },
  });
}

let scenes = [
  {
    text: "test-1",
    callback: () => {
      // 执行函数切换位置
      // 这些坐标都是建模的时候算好的
      translateCamera(
        new THREE.Vector3(-3.23, 3, 4.06),
        new THREE.Vector3(-8, 2, 0)
      );
    },
  },
  {
    text: "test-2",
    callback: () => {
      translateCamera(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0));
    },
  },
  {
    text: "test-3",
    callback: () => {
      translateCamera(new THREE.Vector3(10, 3, 0), new THREE.Vector3(5, 2, 0));
    },
  },
  {
    text: "test-4",
    callback: () => {
      translateCamera(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0));
    },
  },
  {
    text: "test-5",
    callback: () => {
      translateCamera(
        new THREE.Vector3(-20, 1.3, 6.6),
        new THREE.Vector3(5, 2, 0)
      );
    },
  },
];

let index = ref(0);
window.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    if (ani) return;
    ani = true;
    index.value++;
    if (index.value > scenes.length - 1) {
      index.value = 0;
    }
    scenes[index.value].callback();
    makeAni();
  }
});

// 实例化创建漫天星星
const starsInstance = new THREE.InstancedMesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 10,
  }),
  100
);
let startsArr = [];
let endArr = [];
for (let i = 0; i < 100; i++) {
  const x = Math.random() * 100 - 50;
  const y = Math.random() * 100;
  const z = Math.random() * 100 - 50;
  startsArr.push(new THREE.Vector3(x, y, z));

  // 设置矩阵
  const matrix = new THREE.Matrix4();
  matrix.setPosition(x, y, z);
  starsInstance.setMatrixAt(i, matrix);
}

const heartShape = new THREE.Shape();

heartShape.moveTo(25, 25);
heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

let center = new THREE.Vector3(0, 2, 10);
for (let i = 0; i < 100; i++) {
  const point = heartShape.getPoint(i / 100);
  endArr.push(
    new THREE.Vector3(
      center.x + point.x * 0.1,
      center.y + point.y * 0.1,
      center.z
    )
  );

  // // 设置矩阵
  // const matrix = new THREE.Matrix4();
  // matrix.setPosition(x, y, z);
  // starsInstance.setMatrixAt(i, matrix);
}
function makeAni() {
  let p = {
    time: 0,
  };
  gsap.to(p, {
    time: 1,
    duration: 1,
    onUpdate: () => {
      console.log();
      for (let i = 0; i < 100; i++) {
        const x = startsArr[i].x + (endArr[i].x - startsArr[i].x) * p.time;
        const y = startsArr[i].y + (endArr[i].y - startsArr[i].y) * p.time;
        const z = startsArr[i].z + (endArr[i].z - startsArr[i].z) * p.time;

        // // 设置矩阵
        const matrix = new THREE.Matrix4();
        matrix.setPosition(x, y, z);
        starsInstance.setMatrixAt(i, matrix);
      }
      starsInstance.instanceMatrix.needsUpdate = true;
    },
  });
}

scene.add(starsInstance);
</script>

<template>
  <div
    class="scenes"
    :style="{
      transform: `translate3d(0, ${-index * 100}vh, 0)`,
    }"
  >
    <div v-for="(item, index) in scenes" :key="index" class="scenes-container">
      <h1 class="title">{{ item.text }}</h1>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}
.scenes {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none;
  transition: all 1s;
}

.scenes-container {
  width: 100vw;
  height: 100vh;
}

.title {
  padding: 100px 50px;
  font-size: 50px;
  color: #fff;
}
</style>
