import { GUI } from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
/*--------------------------------------- commonit ------------------------------------------*/
export const commonInit = (container: HTMLDivElement | null) => {
  if (!container) return;
  const renderer = RendererInit(container);
  const scene = SceneInit();
  const camera = CameraInit(container);
  HelperInit(scene);
  controllerInit(scene, camera, renderer);
  const render = globalRender(scene, camera, renderer);
  initMouseWheel(camera);
  // LightInit(scene);
  const cube = initMesh(scene);
  const spotLight = initSpotLight(scene, cube);
  spotLightHelperInit(scene, spotLight);
  listenResize(container, camera, renderer);
  GuiInit(spotLight, render);
  renderer.render(scene, camera);
};

const globalRender = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  return () => {
    renderer.render(scene, camera);
  };
};
/*--------------------------------------- renderer ------------------------------------------*/

const RendererInit = (container: HTMLDivElement) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true, //抗锯齿
    alpha: true, //透明背景
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  return renderer;
};

/*--------------------------------------- camera ------------------------------------------*/
const CameraInit = (container: HTMLDivElement) => {
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    1,
    1000
  );
  camera.position.set(50, 50, 50);
  camera.lookAt(0, 0, 0);
  return camera;
};

/*--------------------------------------- scene ------------------------------------------*/
const SceneInit = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  // scene.fog = new THREE.Fog(0x1a1a1a, 1, 1000);
  return scene;
};

/*--------------------------------------- helper ------------------------------------------*/
const HelperInit = (scene: THREE.Scene) => {
  // 坐标轴
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
  // 网格
  // const gridHelper = new THREE.GridHelper(200, 200);
  // scene.add(gridHelper);
};

const spotLightHelperInit = (
  scene: THREE.Scene,
  spotLight: THREE.SpotLight
) => {
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
};

/*--------------------------------------- controller ------------------------------------------*/
const controllerInit = (
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

/*--------------------------------------- light ------------------------------------------*/
const LightInit = (scene: THREE.Scene) => {
  const light = new THREE.AmbientLight(0xffffff, 0.2);
  light.position.set(0, 0, 1);
  scene.add(light);
};

export const initSpotLight = (scene: THREE.Scene, target: THREE.Object3D) => {
  const spotLight = new THREE.SpotLight(0x00ffff, 500);
  spotLight.position.set(50, 50, 50);
  spotLight.target = target;
  spotLight.intensity = 1;
  spotLight.distance = 100;
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  scene.add(spotLight);
  return spotLight;
};

/*--------------------------------------- mesh ------------------------------------------*/
export const initMesh = (scene: THREE.Scene) => {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshLambertMaterial({ color: 0x00f000 });

  const cube = new THREE.Mesh(geometry, material);
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  cube.add(line);

  cube.position.set(5, 5, 5);
  scene.add(cube);

  // //plane
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xfff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.castShadow = true; // 接收阴影
  plane.receiveShadow = true; // 产生阴影
  scene.add(plane);
  return cube;
};

/*--------------------------------------- resize ------------------------------------------*/
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

/*--------------------------------------- gui ------------------------------------------*/
const GuiInit = (spotLight: THREE.SpotLight, render: () => void) => {
  const gui = new GUI();
  //gui修改位置
  gui.domElement.style.position = "absolute";
  gui.domElement.style.top = "50px";
  gui.domElement.style.right = "0px";
  //
  const spotLightFolder = gui.addFolder("SpotLight");
  spotLightFolder.add(spotLight, "intensity", 0, 2).onChange(render);
  spotLightFolder.add(spotLight, "angle", 0, Math.PI).onChange(render);
  spotLightFolder.add(spotLight, "penumbra", 0, 1).onChange(render);
  spotLightFolder.add(spotLight, "decay", 1, 2).onChange(render);
  spotLightFolder.add(spotLight, "distance", 0, 200).onChange(render);
  spotLightFolder.add(spotLight.position, "x", -100, 100).onChange(render);
  spotLightFolder.add(spotLight.position, "y", -100, 100).onChange(render);
  spotLightFolder.add(spotLight.position, "z", -100, 100).onChange(render);
  spotLightFolder.addColor({ color: 0xffffff }, "color").onChange((e) => {
    spotLight.color.set(e);
    render();
  });
  spotLightFolder.open();
};
