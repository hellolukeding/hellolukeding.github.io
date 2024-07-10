import * as CANNON from "cannon-es";
import * as THREE from "three";
import VehicleService from "./VehicleService";

class PhysicsService {
  private world: CANNON.World;
  private vehicleService: VehicleService;
  private loadingManager: THREE.LoadingManager;

  constructor(scene: THREE.Scene) {
    this.loadingManager = new THREE.LoadingManager();
    this.loaderInit();
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase(); //碰撞检测
    this.vehicleService = new VehicleService(
      scene,
      this.world,
      this.loadingManager
    );
  }

  /*--------------------------------------- common ------------------------------------------*/
  init() {
    console.log("physics init done!");
    // this.materialInit();
    this.vehicleService.init();
  }
  /*--------------------------------------- private ------------------------------------------*/

  private loaderInit() {
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(`Loading file: ${url}, ${itemsLoaded}/${itemsTotal}`);
      if (itemsLoaded === itemsTotal) {
        console.log("All loaded");
      }
    };

    this.loadingManager.onLoad = () => {
      this.vehicleService.init();
    };
  }

  private materialInit() {
    const bodyMaterial = new CANNON.Material();
    const groundMaterial = new CANNON.Material();
    const bodyGroundContactMaterial = new CANNON.ContactMaterial(
      bodyMaterial,
      groundMaterial,
      {
        friction: 0.1,
        restitution: 0.3,
      }
    );
    this.world.addContactMaterial(bodyGroundContactMaterial);
  }
}

export default PhysicsService;
