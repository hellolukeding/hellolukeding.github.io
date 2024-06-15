//eslint-disable-file
import * as THREE from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const init = (container: HTMLDivElement | null, gltf: GLTF) => {
  if (!container) return;
  const renderer = initRenderer(container);
  const scene = initScene();
  const camera = initCamera(container);
  const [axesHelper, gridHelper] = HelperInit(scene);
  initController(scene, camera, renderer);
  initMouseWheel(camera);
  listenResize(container, camera, renderer);
  initGLTFLoader(scene, gltf);
  renderer?.render(scene, camera);
};

/*--------------------------------------- renderer ------------------------------------------*/
const initRenderer = (container: HTMLDivElement) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000);
  container.appendChild(renderer.domElement);
  return renderer;
};

/*--------------------------------------- scene ------------------------------------------*/
const initScene = () => {
  return new THREE.Scene();
};

/*--------------------------------------- camera ------------------------------------------*/
const initCamera = (container: HTMLDivElement) => {
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(10, 25, 10);
  return camera;
};

/*--------------------------------------- helper ------------------------------------------*/
const HelperInit = (
  scene: THREE.Scene
): [THREE.AxesHelper, THREE.GridHelper] => {
  // 坐标轴
  const axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);
  // 网格
  const gridHelper = new THREE.GridHelper(200, 200);
  scene.add(gridHelper);
  return [axesHelper, gridHelper];
};

/*--------------------------------------- controller ------------------------------------------*/
const initController = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;
  controls.enablePan = true;
  controls.enableKeys = true;
  controls.keys = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    BOTTOM: 40,
  };
  controls.mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT, // 作用:旋转
    ZOOM: THREE.MOUSE.MIDDLE, // 作用:缩放
    PAN: THREE.MOUSE.LEFT, // 作用:平移
  };

  const tick = () => {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(tick);
  };
  tick();
};

/*--------------------------------------- wheel ------------------------------------------*/
const initMouseWheel = (camera: THREE.PerspectiveCamera) => {
  window.addEventListener(
    "mousewheel",
    (e) => {
      e.preventDefault();
      //@ts-ignore
      camera.position.z += e.deltaY * 0.1;
    },
    { passive: false }
  );
};

/*---------------------------------------  ------------------------------------------*/
const listenResize = (
  container: HTMLDivElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = container.clientWidth / container.clientHeight; // 设置相机的长宽比
    camera.updateProjectionMatrix(); // 更新相机的矩阵
  });
};

/*--------------------------------------- loader ------------------------------------------*/
const initGLTFLoader = (scene: THREE.Scene, gltf: GLTF) => {
  const loader = new GLTFLoader();
  console.log(gltf, "gltf");
  if (gltf?.asset?.version !== "2.0") {
    console.error("GLTF version must be 2.0");
    return;
  }
  loader.parse(JSON.stringify(gltf), "", (gltf) => {
    scene.add(gltf.scene);
  });
};
