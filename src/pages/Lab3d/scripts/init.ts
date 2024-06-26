import { GUI } from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader";
/*--------------------------------------- commonit ------------------------------------------*/
export const commonInit = (
  container: HTMLDivElement | null
): (() => void) | null => {
  if (!container) return null;
  const renderer = RendererInit(container);
  const scene = SceneInit();
  const camera = CameraInit(container);
  const [axesHelper, gridHelper] = HelperInit(scene);
  controllerInit(scene, camera, renderer);
  initMouseWheel(camera);
  // LightInit(scene);
  const cube = initMesh(scene);
  const spotLight = initSpotLight(scene, cube);
  const spotLightHelper = spotLightHelperInit(scene, spotLight);
  const render = globalRender(scene, camera, renderer, spotLightHelper);
  listenResize(container, camera, renderer);
  const gui = GuiInit(spotLight, cube, [axesHelper, gridHelper], render);

  const animate = animationRun(renderer, camera, scene);
  animate();
  renderer.render(scene, camera);

  return () => {
    guiDestroy(gui);
    rendererDestroy(renderer);
  };
};

const guiDestroy = (gui: GUI) => {
  gui.destroy();
};

const rendererDestroy = (renderer: THREE.WebGLRenderer) => {
  renderer.dispose();
};

const globalRender = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  helper: THREE.SpotLightHelper
) => {
  return () => {
    renderer.render(scene, camera);
    helper && helper.update();
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
  scene.fog = new THREE.Fog(0x1a1a1a, 1, 1000);
  return scene;
};

/*--------------------------------------- helper ------------------------------------------*/
const HelperInit = (
  scene: THREE.Scene
): [THREE.AxesHelper, THREE.GridHelper] => {
  // 坐标轴
  const axesHelper = new THREE.AxesHelper(1000);
  //设置宽度

  scene.add(axesHelper);
  // 网格
  const gridHelper = new THREE.GridHelper(200, 200);
  scene.add(gridHelper);
  return [axesHelper, gridHelper];
};

const spotLightHelperInit = (
  scene: THREE.Scene,
  spotLight: THREE.SpotLight
) => {
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
  return spotLightHelper;
};

/*--------------------------------------- controller ------------------------------------------*/
const controllerInit = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  // controls.enableRotate = true;
  controls.enableDamping = true; // 作用是使动画很平滑
  controls.dampingFactor = 0.03;
  controls.zoomSpeed = 1;
  // controls.rotateSpeed = 1;
  //限制旋转角度
  controls.maxPolarAngle = Math.PI / 2;
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
      // camera.position.z += e.deltaY * 0.1;
    },
    { passive: false }
  );
};

/*--------------------------------------- light ------------------------------------------*/
const LightInit = (scene: THREE.Scene) => {
  const light = new THREE.AmbientLight(0xffffff, 500);
  light.position.set(0, 0, 1);
  scene.add(light);
};

export const initSpotLight = (scene: THREE.Scene, target: THREE.Object3D) => {
  const spotLight = new THREE.SpotLight(0xffffff, 500);
  spotLight.position.set(30, 55, 30);
  spotLight.target = target;
  // spotLight.intensity = 1;//光照强度
  spotLight.distance = 0;
  spotLight.angle = Math.PI / 8;
  spotLight.penumbra = 0.1; //边缘软化
  spotLight.decay = 1; //光线衰减
  spotLight.castShadow = true; // 产生阴影
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 10;
  spotLight.shadow.focus = 1;

  spotLight.shadow.camera.near = 0.1;
  spotLight.shadow.camera.far = 500;
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
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
  cube.add(line);

  cube.position.set(5, 5, 5);

  cube.castShadow = true; // 产生阴影
  scene.add(cube);

  // //plane
  const planeGeometry = new THREE.PlaneGeometry(500, 500);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -150;
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
const GuiInit = (
  spotLight: THREE.SpotLight,
  cube: THREE.Object3D,
  helper: [THREE.AxesHelper, THREE.GridHelper],
  render: () => void
) => {
  const gui = new GUI();
  //gui修改位置
  gui.domElement.style.position = "absolute";
  gui.domElement.style.top = "50px";
  gui.domElement.style.right = "0px";
  //
  const spotLightFolder = gui.addFolder("SpotLight");
  spotLightFolder.add(spotLight, "intensity", 1, 1000).onChange(render);
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
  //spotLightFolder.open();
  //
  const cubeHelper = gui.addFolder("Cube");
  cubeHelper.add(cube.position, "x", -1000, 1000).onChange(render);
  cubeHelper.add(cube.position, "y", -1000, 1000).onChange(render);
  cubeHelper.add(cube.position, "z", -1000, 1000).onChange(render);
  cubeHelper
    .add(cube.scale, "x", 0, 10)
    .name("x-scale")
    .onChange(render);
  cubeHelper
    .add(cube.scale, "y", 0, 10)
    .name("y-scale")
    .onChange(render);
  cubeHelper
    .add(cube.scale, "z", 0, 10)
    .name("z-scale")
    .onChange(render);
  //helper
  const helperFolder = gui.addFolder("Helper");
  helperFolder
    .add(helper[0], "visible")
    .onChange(render)
    .name("axes-helper");
  helperFolder
    .add(helper[1], "visible")
    .onChange(render)
    .name("grid-helper");
  // Remove the line that adds the "size" property to the GUI folder
  // helperFolder.add(helper[1], "size", 10, 100).onChange(render);

  return gui;
};

/*--------------------------------------- animation ------------------------------------------*/
const animationRun = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene
) => {
  const composer = new EffectComposer(renderer); // 后期处理

  const animate = () => {
    requestAnimationFrame(animate);
    composer.render();
  };

  const renderPass = new RenderPass(scene, camera); // 渲染通道
  const glitchPass = new GlitchPass(); // 故障通道
  const outputPass = new OutputPass(); // 输出通道
  const luminosityPass = new ShaderPass(LuminosityShader); // 亮度通道
  composer.addPass(renderPass);
  composer.addPass(glitchPass);
  composer.addPass(outputPass);
  composer.addPass(luminosityPass);
  return animate;
};
