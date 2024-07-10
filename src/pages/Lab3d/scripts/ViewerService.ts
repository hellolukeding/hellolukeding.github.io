import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ViewerService {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  public axesHelper?: THREE.AxesHelper;
  public gridHelper?: THREE.GridHelper;
  constructor(container: HTMLDivElement | null) {
    if (!container) throw new Error("container is null");
    //renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);
    //scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0x1a1a1a, 1, 1000);
    //camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    this.camera.position.set(50, 50, 50);
    this.camera.lookAt(0, 0, 0);
  }

  public init() {
    this.helperInit();
    this.controllerInit();
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    this.renderer.dispose();
  }

  public getViewer() {
    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
    };
  }

  private helperInit() {
    const axesHelper = new THREE.AxesHelper(1000);
    const gridHelper = new THREE.GridHelper(200, 200);
    this.axesHelper = axesHelper;
    this.gridHelper = gridHelper;
    this.scene.add(axesHelper);
    this.scene.add(gridHelper);
  }
  private controllerInit() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
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
      this.renderer.render(this.scene, this.camera);
      controls.update();
      requestAnimationFrame(tick);
    };
    tick();
  }
}

export default ViewerService;
