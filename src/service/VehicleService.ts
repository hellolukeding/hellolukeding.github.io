import * as CANNON from "cannon-es";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class VehicleService {
  loadingManager: THREE.LoadingManager;
  world: CANNON.World;
  scene: THREE.Scene;
  car?: {};
  chassis?: { helpChassisMat: THREE.MeshBasicMaterial };
  chassisModel?: GLTF;
  wheelModel?: {};
  wheels?: never[];
  chassisDimension?: { x: number; y: number; z: number };
  wheelScale?: { frontWheel: number; hindWheel: number };
  controlOptions?: {
    maxSteerVal: number;
    maxForce: number;
    brakeForce: number;
    slowDownCar: number;
    primaryKeys: {
      forward: string;
      backward: string;
      left: string;
      right: string;
      reset: string;
      brake: string;
    };
    secondaryKeys: {
      forward: string;
      backward: string;
      left: string;
      right: string;
      reset: string;
      brake: string;
    };
  };

  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    loadingManager: THREE.LoadingManager
  ) {
    this.scene = scene;
    this.world = world;
    this.loadingManager = loadingManager;

    // this.car = {
    //   helpChassisGeo: {},
    //   helpChassis: {},
    //   helpChassisMat: {},
    // };
    // this.chassis = undefined;
    // this.chassisModel = undefined;
    // this.wheelModel = {};
    // this.wheels = [];
    // this.chassisDimension = { x: 1.96, y: 1, z: 4.47 };
    // this.chassisModel = { x: 0, y: -0.59, z: 0 };
    // this.wheelScale = { frontWheel: 0.67, hindWheel: 0.67 };
    // this.controlOptions = {
    //   maxSteerVal: 0.5,
    //   maxForce: 750,
    //   brakeForce: 36,
    //   slowDownCar: 19.6,
    //   primaryKeys: {
    //     forward: "w",
    //     backward: "s",
    //     left: "a",
    //     right: "d",
    //     reset: "r",
    //     brake: " ",
    //   },
    //   secondaryKeys: {
    //     forward: "arrowup",
    //     backward: "arrowdown",
    //     left: "arrowleft",
    //     right: "arrowright",
    //     reset: "r",
    //     brake: " ",
    //   },
    // };
  }
  /*--------------------------------------- common ------------------------------------------*/
  /*--------------------------------------- private ------------------------------------------*/
  private loadModels() {
    const gltfLoader = new GLTFLoader(this.loadingManager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.setDecoderPath("draco/");

    gltfLoader.setDRACOLoader(dracoLoader);
  }
}

export default VehicleService;
