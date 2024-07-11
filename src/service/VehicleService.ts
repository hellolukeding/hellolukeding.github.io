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
  chassis?: GLTF["scene"]; //车身模型
  chassisPhysicsBody?: CANNON.Body; //车身物理模型
  chassisHelpChassisGeo?: THREE.BoxGeometry; //车身辅助模型
  chassisHelpChassisMat?: THREE.MeshBasicMaterial; //车身辅助材质
  chassisHelpChassis?: THREE.Mesh;
  chassisModel?: GLTF; //车身模型
  wheelModels: THREE.Group<THREE.Object3DEventMap>[] = []; //轮子模型
  wheelHelpModels: THREE.Mesh[] = []; //轮子辅助模型
  wheelPhysicsBodies: CANNON.Body[] = []; //轮子物理模型

  chassisDimension: { x: number; y: number; z: number };
  wheelScale: { frontWheel: number; hindWheel: number };
  chassisModelPos: Pos;
  wheelPos: [number, number, number][] = [
    [0.75, 0.1, -1.32],
    [-0.78, 0.1, -1.32],
    [0.75, 0.1, 1.25],
    [-0.78, 0.1, 1.25],
  ];

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
    this.setPlane();
    this.setChassis();
    this.setWheels();
    this.controls();
    this.update();
    console.log("vehicle init done!");
  }

  /*--------------------------------------- private ------------------------------------------*/
  public loadModels() {
    const gltfLoader = new GLTFLoader(this.loadingManager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({
      type: "js",
    });
    dracoLoader.setDecoderPath("/draco/gltf/");
    gltfLoader.setDRACOLoader(dracoLoader);
    // 加载车身模型
    gltfLoader.load("/models/mclaren/draco/chassis.gltf", (gltf) => {
      this.chassisModel = gltf; //车身模型
      this.chassis = gltf.scene; //车身模型
      this.chassisHelpChassisGeo = new THREE.BoxGeometry(1, 1, 1);
      this.chassisHelpChassisMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
      this.chassisHelpChassis = new THREE.Mesh(
        this.chassisHelpChassisGeo,
        this.chassisHelpChassisMat
      );
      this.scene.add(this.chassis, this.chassisHelpChassis);
    });

    //加载轮子模型
    for (let i = 0; i < 4; i++) {
      gltfLoader.load(`/models/mclaren/draco/wheel.gltf`, (gltf) => {
        const model = gltf.scene;
        if (i % 2 === 1) {
          model.scale.set(
            -1 * this.wheelScale!.frontWheel,
            this.wheelScale!.frontWheel,
            -1 * this.wheelScale!.frontWheel
          );
        } else {
          model.scale.set(
            this.wheelScale!.frontWheel,
            this.wheelScale!.frontWheel,
            this.wheelScale!.frontWheel
          );
        }
        this.wheelModels.push(model);
        this.scene.add(model);
      });
    }
  }

  public setPlane() {
    //model plane
    const texture = new THREE.TextureLoader().load(
      "/imgs/texture/texture.jpeg"
    );
    const planeHelpGeo = new THREE.PlaneGeometry(1000, 1000);
    const planeHelpMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const planeHelp = new THREE.Mesh(planeHelpGeo, planeHelpMat);
    planeHelp.rotation.x = -Math.PI / 2;
    this.scene.add(planeHelp);
    //physics plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0,
      material: new CANNON.Material({ friction: 0 }),
    });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    this.world.addBody(groundBody);
  }

  private setChassis() {
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(
        this.chassisDimension.x * 0.5,
        this.chassisDimension.y * 0.5,
        this.chassisDimension.z * 0.5
      )
    );
    const chassisBody = new CANNON.Body({
      mass: 250, // 质量
      material: new CANNON.Material({ friction: 0 }), // 摩擦力
    });
    chassisBody.addShape(chassisShape);
    this.chassisPhysicsBody = chassisBody;
    this.chassisHelpChassis!.scale.set(
      this.chassisDimension.x,
      this.chassisDimension.y,
      this.chassisDimension.z
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
    this.wheelModels.forEach((wheel, index) => {
      //set wheel model position
      wheel.position.set(
        this.wheelPos[index][0],
        this.wheelPos[index][1],
        this.wheelPos[index][2]
      );
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
      options.chassisConnectionPointLocal = new CANNON.Vec3(
        this.wheelPos[index][0],
        this.wheelPos[index][1],
        this.wheelPos[index][2]
      );
      this.car!.addWheel(options);
      //physics model
      const cylinderShape = new CANNON.Cylinder(
        options.radius,
        options.radius,
        options.radius / 2,
        20
      );
      const wheelBody = new CANNON.Body({
        mass: 1,
        material: new CANNON.Material({ friction: 0 }),
      });
      const quaternion = new CANNON.Quaternion().setFromEuler(
        0,
        0,
        -Math.PI / 2
      );
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion);
      this.world.addBody(wheelBody);
      this.wheelPhysicsBodies.push(wheelBody);
      //physics model helper
      const wheelHelpWheelsGeo = new THREE.CylinderGeometry(
        options.radius,
        options.radius,
        options.radius / 2,
        20
      );
      const wheelHelpWheelsMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      const wheelHelpWheels = new THREE.Mesh(
        wheelHelpWheelsGeo,
        wheelHelpWheelsMat
      );
      wheelHelpWheels.position.copy(options.chassisConnectionPointLocal);
      wheelHelpWheels.quaternion.copy(quaternion);
      this.scene.add(wheelHelpWheels);
      this.wheelHelpModels.push(wheelHelpWheels);
      //constraint
      const wheelConstraint = new CANNON.ConeTwistConstraint(
        this.car!.chassisBody,
        wheelBody,
        {
          pivotA: new CANNON.Vec3(
            this.wheelPos[index][0],
            this.wheelPos[index][1],
            this.wheelPos[index][2]
          ),
          axisA: new CANNON.Vec3(0, 1, 0),
          pivotB: new CANNON.Vec3(0, 0, 0),
          axisB: new CANNON.Vec3(0, 1, 0),
        }
      );
      this.world.addConstraint(wheelConstraint);
    });
  }

  private controls() {
    const keysPressed: string[] = [];
    window.addEventListener("keydown", (e) => {
      if (!keysPressed.includes(e.key.toLowerCase()))
        keysPressed.push(e.key.toLowerCase());
      hindMovement();
      console.log(keysPressed);
    });
    window.addEventListener("keyup", (e) => {
      keysPressed.splice(keysPressed.indexOf(e.key.toLowerCase()), 1);
      hindMovement();
      console.log(keysPressed);
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
      console.log(this.car!.chassisBody.position);
    };
  }

  private update() {
    // const updateWorld = () => {
    //   console.log("update");
    //   // this.car!.updateVehicle(1 / 60);
    //   // this.wheelModels.forEach((wheel, index) => {
    //   //   const wheelBody = this.car!.wheels[index];
    //   //   wheel.position.copy(wheelBody.position);
    //   //   wheel.quaternion.copy(wheelBody.quaternion);
    //   // });
    // };
    // this.world.addEventListener("postStep", updateWorld);
  }
}

export default VehicleService;
