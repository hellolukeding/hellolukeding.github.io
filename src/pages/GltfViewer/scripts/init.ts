import * as THREE from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
export const init = (container: HTMLDivElement | null) => {
  if (!container) return;

  const renderer = initRenderer(container);
  const scene = initScene();
  const camera = initCamera();
  const light = initLight();
  listenResize(container, camera, renderer);
  const controls = initOrbitController(camera, renderer);
  scene.add(light);

  // const geometry = new THREE.BoxGeometry(20, 20, 20);

  // const materials = [
  //   new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  //   new THREE.MeshBasicMaterial({ color: 0x0000ff }),
  //   new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  //   new THREE.MeshBasicMaterial({ color: 0xffff00 }),
  //   new THREE.MeshBasicMaterial({ color: 0xff00ff }),
  //   new THREE.MeshBasicMaterial({ color: 0x00ffff }),
  // ];
  // const mesh = new THREE.Mesh(geometry, materials);
  // scene.add(mesh);

  // // Create an edges geometry from the cube geometry
  // const edges = new THREE.EdgesGeometry(mesh.geometry);

  // // Create a line segments object with the edges geometry and a basic material
  // const line = new THREE.LineSegments(
  //   edges,
  //   new THREE.LineBasicMaterial({ color: 0xffffff }) // Set the color of the lines
  // );

  // mesh.add(line);
  initPlanet(scene, renderer, camera, controls);

  renderer.render(scene, camera);
  // const animate = () => {
  //   requestAnimationFrame(animate);
  //   mesh.rotation.x += 0.01;
  //   mesh.rotation.y += 0.02;
  //   renderer.render(scene, camera);
  // };
  // animate();
  initMouseWheel(camera);
};

/*--------------------------------------- renderer ------------------------------------------*/
export const initRenderer = (
  container: HTMLDivElement
): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
    alpha: true, // 透明背景
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  return renderer;
};

/*--------------------------------------- scene ------------------------------------------*/

export const initScene = (): THREE.Scene => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  scene.fog = new THREE.Fog(0x1a1a1a, 1, 1000);
  return scene;
};

/*--------------------------------------- camera ------------------------------------------*/
export const initCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  return camera;
};

/*--------------------------------------- light ------------------------------------------*/
export const initLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 3);
  light.position.set(0, 0, 1);

  return light;
};

/*--------------------------------------- resize ------------------------------------------*/
export const listenResize = (
  container: HTMLDivElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = container.clientWidth / container.clientHeight; // 设置相机的长宽比
    camera.updateProjectionMatrix();
  });
};
/*--------------------------------------- obitcontroller ------------------------------------------*/
export const initOrbitController = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.update();
  return controls;
};

/*--------------------------------------- planet ------------------------------------------*/
export const initPlanet = (
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls
) => {
  const SphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x03c03c,
    wireframe: true,
  });
  const SphereGeometry = new THREE.SphereGeometry(80, 32, 32);
  const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
  scene.add(planet);
  /*---------------------------------------  ------------------------------------------*/
  const TorusGeometry = new THREE.TorusGeometry(150, 8, 2, 120);
  const TorusMaterial = new THREE.MeshLambertMaterial({
    color: 0x40a9ff,
    wireframe: true,
  });
  const ring = new THREE.Mesh(TorusGeometry, TorusMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.rotation.y = -0.1 * (Math.PI / 2);
  scene.add(ring);
  /*---------------------------------------  ------------------------------------------*/
  const IcoGeometry = new THREE.IcosahedronGeometry(16, 0);
  const IcoMaterial = new THREE.MeshToonMaterial({ color: 0xfffc00 });
  const satellite = new THREE.Mesh(IcoGeometry, IcoMaterial);
  scene.add(satellite);
  /*---------------------------------------  ------------------------------------------*/
  const stars = new THREE.Group();
  for (let i = 0; i < 500; i++) {
    const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
    const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 700;
    mesh.position.y = (Math.random() - 0.5) * 700;
    mesh.position.z = (Math.random() - 0.5) * 700;
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;
    stars.add(mesh);
  }
  scene.add(stars);

  let rot = 0;
  // 动画
  const axis = new THREE.Vector3(0, 0, 1);
  const tick = () => {
    // 更新渲染器
    renderer.render(scene, camera);
    // 给网格模型添加一个转动动画
    rot += Math.random() * 0.8;
    const radian = (rot * Math.PI) / 180;
    // 星球位置动画
    planet && (planet.rotation.y += 0.005);
    // 星球轨道环位置动画
    ring && ring.rotateOnAxis(axis, Math.PI / 400);
    // 卫星位置动画
    satellite.position.x = 250 * Math.sin(radian);
    satellite.position.y = 100 * Math.cos(radian);
    satellite.position.z = -100 * Math.cos(radian);
    satellite.rotation.x += 0.005;
    satellite.rotation.y += 0.005;
    satellite.rotation.z -= 0.005;
    // 星星动画
    stars.rotation.y += 0.0009;
    stars.rotation.z -= 0.0003;
    // 更新控制器
    controls.update();
    // 页面重绘时调用自身
    window.requestAnimationFrame(tick);
  };
  tick();
};

/*---------------------------------------  ------------------------------------------*/
// 滚轮缩放大小
export const initMouseWheel = (camera: THREE.PerspectiveCamera) => {
  window.addEventListener("mousewheel", (e) => {
    //@ts-ignore
    camera.position.z += e.deltaY * 0.1;
  });
};
