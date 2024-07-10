import * as CANNON from "cannon-es";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface Pos {
  x: number;
  y: number;
  z: number;
}
class VehicleService {
  loadingManager: THREE.LoadingManager;
  world: CANNON.World;
  scene: THREE.Scene;
  car?: CANNON.RaycastVehicle;
  chassis?: GLTF["scene"];
  chassisHelpChassisGeo?: THREE.BoxGeometry;
  chassisHelpChassisMat?: THREE.MeshBasicMaterial;
  chassisHelpChassis?: THREE.Mesh;
  chassisModel?: GLTF;
  wheelModel?: THREE.Group<THREE.Object3DEventMap>[];
  wheels?: any[];
  chassisDimension?: { x: number; y: number; z: number };
  wheelScale?: { frontWheel: number; hindWheel: number };
  chassisModelPos: Pos;
  controlOptions: {
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

    this.wheelScale = { frontWheel: 0.67, hindWheel: 0.67 };
    this.chassisDimension = { x: 1.96, y: 1, z: 4.47 };
    this.wheels = [];
    this.chassisModelPos = { x: 0, y: -0.59, z: 0 };
    this.controlOptions = {
      maxSteerVal: 0.5,
      maxForce: 750,
      brakeForce: 36,
      slowDownCar: 19.6,
      primaryKeys: {
        forward: "w",
        backward: "s",
        left: "a",
        right: "d",
        reset: "r",
        brake: " ",
      },
      secondaryKeys: {
        forward: "arrowup",
        backward: "arrowdown",
        left: "arrowleft",
        right: "arrowright",
        reset: "r",
        brake: " ",
      },
    };
  }
  /*--------------------------------------- common ------------------------------------------*/
  public init() {
    this.loadModels();
    // this.setChassis();
    // this.setWheels();
    // this.controls();
    // this.update();
    console.log("vehicle init done!");
  }
  /*--------------------------------------- private ------------------------------------------*/
  private loadModels() {
    const dracoModuleConfig = {
      onModuleLoaded: (draco: any) => {
        // Draco is loaded
        console.log(draco);
        console.log("Draco is loaded");
      },
      wasmMemory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
    };
    const gltfLoader = new GLTFLoader(this.loadingManager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig(dracoModuleConfig);
    dracoLoader.setDecoderPath("draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    //加载车身模型
    // gltfLoader.load("/models/mclaren/draco/chassis.gltf", (gltf) => {
    //   this.chassisModel = gltf;
    //   this.chassis = gltf.scene;
    //   this.chassisHelpChassisGeo = new THREE.BoxGeometry(1, 1, 1);
    //   this.chassisHelpChassisMat = new THREE.MeshBasicMaterial({
    //     color: 0xff0000,
    //     wireframe: true,
    //   });
    //   this.chassisHelpChassis = new THREE.Mesh(
    //     this.chassisHelpChassisGeo,
    //     this.chassisHelpChassisMat
    //   );
    //   this.scene.add(this.chassis, this.chassisHelpChassis);
    // });
    return;

    //加载轮子模型
    for (let i = 0; i < 4; i++) {
      gltfLoader.load(`/models/mclaren/draco/wheel.gltf`, (gltf) => {
        // this.wheelModel![i] = gltf.scene;
        // this.scene.add(this.wheelModel![i]);
        const model = gltf.scene;
        if (i === 1 || i === 3) {
          this.wheelModel![i].scale.set(
            -1 * this.wheelScale!.frontWheel,
            this.wheelScale!.frontWheel,
            -1 * this.wheelScale!.frontWheel
          );
        } else {
          this.wheelModel![i].scale.set(
            this.wheelScale!.frontWheel,
            this.wheelScale!.frontWheel,
            this.wheelScale!.frontWheel
          );
        }
        this.scene.add(this.wheelModel![i]);
      });
    }
  }

  private setChassis() {
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(
        this.chassisDimension!.x * 0.5,
        this.chassisDimension!.y * 0.5,
        this.chassisDimension!.z * 0.5
      )
    );
    const chassisBody = new CANNON.Body({
      mass: 250,
      material: new CANNON.Material({ friction: 0 }),
    });
    chassisBody.addShape(chassisShape);
    this.chassisHelpChassis!.visible = false;
    this.chassisHelpChassis!.scale.set(
      this.chassisDimension!.x,
      this.chassisDimension!.y,
      this.chassisDimension!.z
    );

    this.car = new CANNON.RaycastVehicle({
      chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    });
    this.car.addToWorld(this.world);
  }

  private setWheels() {
    const options = {
      radius: 0.34,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 55,
      suspensionRestLength: 0.5,
      frictionSlip: 30,
      dampingRelaxation: 2.3,
      dampingCompression: 4.3,
      maxSuspensionForce: 10000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
      maxSuspensionTravel: 1,
      customSlidingRotationalSpeed: 30,
    };

    const setWheelChassisConnectionPoint = (
      index: number,
      position: CANNON.Vec3
    ) => {
      this.car!.wheelInfos[index].chassisConnectionPointLocal.copy(position);
    };

    this.car!.wheelInfos = [];
    this.car!.addWheel(options);
    this.car!.addWheel(options);
    this.car!.addWheel(options);
    this.car!.addWheel(options);

    setWheelChassisConnectionPoint(0, new CANNON.Vec3(0.75, 0.1, -1.32));
    setWheelChassisConnectionPoint(1, new CANNON.Vec3(-0.78, 0.1, -1.32));
    setWheelChassisConnectionPoint(2, new CANNON.Vec3(0.75, 0.1, 1.25));
    setWheelChassisConnectionPoint(3, new CANNON.Vec3(-0.78, 0.1, 1.25));

    this.car!.wheelInfos.forEach((wheel, index) => {
      const cylinderShape = new CANNON.Cylinder(
        wheel.radius,
        wheel.radius,
        wheel.radius / 2,
        20
      );

      const wheelBody = new CANNON.Body({
        mass: 1,
        material: new CANNON.Material({ friction: 0 }),
      });

      const quaternion = new CANNON.Quaternion().setFromEuler(
        -Math.PI / 2,
        0,
        0
      );
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion);
      this.wheels![index].wheelBody = wheelBody;
      this.wheels![index].helpWheelsGeo = new THREE.CylinderGeometry(
        wheel.radius,
        wheel.radius,
        wheel.radius / 2,
        20
      );
      this.wheels![index].helpWheelsGeo.rotateZ(Math.PI / 2);
      this.wheels![index].helpWheelsMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
      });
      this.wheels![index].helpWheels = new THREE.Mesh(
        this.wheels![index].helpWheelsGeo,
        this.wheels![index].helpWheelsMat
      );
      this.wheels![index].helpWheels.visible = false;
      this.scene.add(this.wheels![index].helpWheels);
    });
  }

  private controls() {
    const keysPressed: string[] = [];
    window.addEventListener("keydown", (e) => {
      if (!keysPressed.includes(e.key.toLowerCase()))
        keysPressed.push(e.key.toLowerCase());
    });
    window.addEventListener("keyup", (e) => {
      keysPressed.splice(keysPressed.indexOf(e.key.toLowerCase()), 1);
    });

    const hindMovement = () => {
      const { primaryKeys, secondaryKeys } = this.controlOptions;

      const resetCar = () => {
        this.car!.chassisBody.position.set(0, 4, 0);
        this.car!.chassisBody.quaternion.set(0, 0, 0, 1);
        this.car!.chassisBody.angularVelocity.set(0, 0, 0);
        this.car!.chassisBody.velocity.set(0, 0, 0);
      };
      const brake = () => {
        this.car!.setBrake(this.controlOptions.brakeForce, 0);
        this.car!.setBrake(this.controlOptions.brakeForce, 1);
        this.car!.setBrake(this.controlOptions.brakeForce, 2);
        this.car!.setBrake(this.controlOptions.brakeForce, 3);
      };

      const stopCar = () => {
        this.car!.setBrake(this.controlOptions.slowDownCar, 0);
        this.car!.setBrake(this.controlOptions.slowDownCar, 1);
        this.car!.setBrake(this.controlOptions.slowDownCar, 2);
        this.car!.setBrake(this.controlOptions.slowDownCar, 3);
      };

      const stopSteer = () => {
        this.car!.setSteeringValue(0, 2);
        this.car!.setSteeringValue(0, 3);
      };
      if (
        keysPressed.includes(primaryKeys.reset) ||
        keysPressed.includes(secondaryKeys.reset)
      )
        resetCar();

      if (
        !keysPressed.includes(primaryKeys.brake) &&
        !keysPressed.includes(secondaryKeys.brake)
      ) {
        this.car!.setBrake(0, 0);
        this.car!.setBrake(0, 1);
        this.car!.setBrake(0, 2);
        this.car!.setBrake(0, 3);

        if (
          keysPressed.includes(primaryKeys.left) ||
          keysPressed.includes(secondaryKeys.left)
        ) {
          this.car!.setSteeringValue(this.controlOptions.maxSteerVal * 1, 2);
          this.car!.setSteeringValue(this.controlOptions.maxSteerVal * 1, 3);
        } else if (
          keysPressed.includes(primaryKeys.right) ||
          keysPressed.includes(secondaryKeys.right)
        ) {
          this.car!.setSteeringValue(this.controlOptions.maxSteerVal * -1, 2);
          this.car!.setSteeringValue(this.controlOptions.maxSteerVal * -1, 3);
        } else stopSteer();

        if (
          keysPressed.includes(primaryKeys.forward) ||
          keysPressed.includes(secondaryKeys.forward)
        ) {
          this.car!.applyEngineForce(this.controlOptions.maxForce * -1, 0);
          this.car!.applyEngineForce(this.controlOptions.maxForce * -1, 1);
          this.car!.applyEngineForce(this.controlOptions.maxForce * -1, 2);
          this.car!.applyEngineForce(this.controlOptions.maxForce * -1, 3);
        } else if (
          keysPressed.includes(primaryKeys.backward) ||
          keysPressed.includes(secondaryKeys.backward)
        ) {
          this.car!.applyEngineForce(this.controlOptions.maxForce * 1, 0);
          this.car!.applyEngineForce(this.controlOptions.maxForce * 1, 1);
          this.car!.applyEngineForce(this.controlOptions.maxForce * 1, 2);
          this.car!.applyEngineForce(this.controlOptions.maxForce * 1, 3);
        } else stopCar();
      } else brake();
    };
  }

  private update() {
    const updateWorld = () => {
      if (this.car && this.chassis && this.wheels![0]) {
        this.chassis.position.set(
          this.car.chassisBody.position.x + this.chassisModelPos.x,
          this.car.chassisBody.position.y + this.chassisModelPos.y,
          this.car.chassisBody.position.z + this.chassisModelPos.z
        );
        this.chassis.quaternion.copy(this.car.chassisBody.quaternion);
        this.chassisHelpChassis!.position.copy(this.car.chassisBody.position);
        this.chassisHelpChassis!.quaternion.copy(
          this.car.chassisBody.quaternion
        );
        for (let i = 0; i < 4; i++) {
          if (this.wheels![i].helpWheels && this.car.wheelInfos[i]) {
            this.car.updateWheelTransform(i);
            this.wheels![i].position.copy(
              this.car.wheelInfos[i].worldTransform.position
            );
            this.wheels![i].quaternion.copy(
              this.car.wheelInfos[i].worldTransform.quaternion
            );
            this.wheels![i].helpWheels.position.copy(
              this.car.wheelInfos[i].worldTransform.position
            );
            this.wheels![i].helpWheels.quaternion.copy(
              this.car.wheelInfos[i].worldTransform.quaternion
            );
          }
        }
      }
    };
    this.world.addEventListener("postStep", updateWorld);
  }
}

export default VehicleService;
