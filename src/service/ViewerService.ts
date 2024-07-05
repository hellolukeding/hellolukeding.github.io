import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
class ViewerService {
  private container: HTMLDivElement;
  private scene?: THREE.Scene;
  private camera?: THREE.Camera;
  private renderer?: THREE.WebGLRenderer;

  axesHelper?: THREE.AxesHelper;
  gridHelper?: THREE.GridHelper;

  constructor(container: HTMLDivElement | null) {
    if (!container) {
      throw new Error("container is null");
    }
    this.container = container;
  }

  /*--------------------------------------- 公共方法 ------------------------------------------*/
  init() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true, //抗锯齿
      alpha: true, //透明背景
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(renderer.domElement);
    //
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x252525);
    const camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      99999999
    );
    camera.position.set(10000, 10000, 10000);
    camera.lookAt(0, 0, 0);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.helperInit();
    this.controllerInit();
  }

  getViewer() {
    if (!this.renderer || !this.scene || !this.camera) {
      throw new Error("viewer not init");
    }
    return {
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
    };
  }
  /*--------------------------------------- 私有方法 ------------------------------------------*/
  private helperInit() {
    const axesHelper = new THREE.AxesHelper(99999999);
    this.scene?.add(axesHelper);
    const gridHelper = new THREE.GridHelper(10000000, 10000);
    this.scene?.add(gridHelper);
    this.axesHelper = axesHelper;
    this.gridHelper = gridHelper;
  }

  private controllerInit() {
    const controls = new OrbitControls(this.camera!, this.renderer!.domElement);
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
      this.renderer!.render(this.scene!, this.camera!);
      // controls.update();
      requestAnimationFrame(tick);
    };
    tick();
  }
}

export default ViewerService;
