## 相机

相机分为多种

### CubeCamera

Three.js 中的 CubeCamera 是用于实现反射效果的一种特殊相机。它可以捕获场景的全 360 度环境信息,并将其存储在 6 个纹理中,形成一个立方体纹理(cube texture)。

CubeCamera 的主要作用如下:

1. **实现反射效果** ：立方体纹理可以用于实现物体的反射效果。比如在金属或者有镜面的材质上,使用从 CubeCamera 捕获的立方体纹理作为材质的环境贴图(envMap)属性,就可以产生逼真的反射效果。
2. **实现环境光照** ：除了反射效果,立方体纹理也可以用于实现环境光照。游戏或场景中的光照信息可以从 CubeCamera 捕获的立方体纹理中获取,从而产生更加逼真的光照效果。
3. **用于 skybox 或 skydome** ：CubeCamera 捕获的立方体纹理也可以用于创建 skybox 或 skydome,从而营造出一个沉浸式的游戏或场景环境。

### OrthographicCamera 正交相机

在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。

这对于渲染 2D 场景或者 UI 元素是非常有用的。

### PerspectiveCamera

这一投影模式被用来模拟人眼所看到的景象，它是 3D 场景的渲染中使用得最普遍的投影模式。

### StereoCamera 立体相机

双透视摄像机（立体相机）常被用于创建[3D Anaglyph](https://en.wikipedia.org/wiki/Anaglyph_3D)（3D 立体影像） 或者[Parallax Barrier](https://en.wikipedia.org/wiki/parallax_barrier)（视差屏障）。

## 材质 material

- 基础线条材质（LineBasicMaterial）
- 虚线材质(LineDashedMaterial)
- 基础网格材质(MeshBasicMaterial)
- 深度网格材质(MeshDepthMaterial)
- MeshDistanceMaterial 用于阴影
- Lambert 网格材质(MeshLambertMaterial) （无高光）
- MeshMatcapMaterial 有高光
- 法线网格材质(MeshNormalMaterial) 颜色表示高光
- Phong 网格材质(MeshPhongMaterial) 非物理网格材质
- 物理网格材质(MeshPhysicalMaterial)
- 标准网格材质(MeshStandardMaterial)
- MeshToonMaterial
- 点材质(PointsMaterial)
- 原始着色器材质(RawShaderMaterial)
- 着色器材质(ShaderMaterial)
- 阴影材质(ShadowMaterial)
- 点精灵材质(SpriteMaterial)

## 渲染器

### webgl renderer

WebGL Render 用[WebGL](https://en.wikipedia.org/wiki/WebGL)渲染出你精心制作的场景。

### CSS 2D 渲染器（CSS2DRenderer）

如果你希望将三维物体和基于 HTML 的标签相结合，则这一渲染器将十分有用。在这里，各个 DOM 元素也被包含到一个**CSS2DObject**实例中，并被添加到场景图中。

### CSS 3D 渲染器（CSS3DRenderer）

CSS3DRenderer 用于通过 CSS3 的[transform](https://www.w3schools.com/cssref/css3_pr_transform.asp)属性， 将层级的 3D 变换应用到 DOM 元素上。 如果你希望不借助基于 canvas 的渲染来在你的网站上应用 3D 变换，那么这一渲染器十分有趣。 同时，它也可以将 DOM 元素与 WebGL 的内容相结合。

### SVG 渲染器（SVGRenderer）

SVGRenderer 被用于使用 SVG 来渲染几何数据，所产生的矢量图形在以下几个方面十分有用：

- 动画标志（logo）或者图标（icon）
- 可交互的 2D 或 3D 图表或图形
- 交互式地图
- 复杂的或包含动画的用户界面

```typescript
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

/*---------------------------------------   ------------------------------------------*/
export const destroy = () => {
  window.removeEventListener("resize", () => {});
  window.removeEventListener("mousewheel", () => {});
  window.cancelAnimationFrame(0);
};
```
