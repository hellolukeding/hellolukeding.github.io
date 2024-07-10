import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import viewerService from "./ViewerService";
class GlbService {
  private loader: GLTFLoader;
  private scene: THREE.Scene;
  constructor(scene: THREE.Scene) {
    this.loader = new GLTFLoader();
    this.scene = scene;
  }

  /*--------------------------------------- common ------------------------------------------*/
  init() {

  }

  parseGltf(gltf: ArrayBuffer) {
    this.loader.parse(
      gltf,
      '',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // 假设我们想要增加材质的发光效果使之更明显
            child.material.emissive = new THREE.Color(0xefefef); // 增加一些微弱的自发光效果
            child.material.emissiveIntensity = 1; // 调整自发光强度

            //edge
            const edges = new THREE.EdgesGeometry(child.geometry);
            const positions = edges.attributes.position.array;
            const newPositions = [];

            // 检查每条边是否平行于 XZ、XY 或 YZ 平面
            for (let i = 0; i < positions.length; i += 6) {
              const x1 = positions[i];
              const y1 = positions[i + 1];
              const z1 = positions[i + 2];
              const x2 = positions[i + 3];
              const y2 = positions[i + 4];
              const z2 = positions[i + 5];

              const dx = x2 - x1;
              const dy = y2 - y1;
              const dz = z2 - z1;

              if ((dx === 0 && dy === 0) || (dx === 0 && dz === 0) || (dy === 0 && dz === 0)) {
                // 该边平行于某个平面，保留它
                newPositions.push(x1, y1, z1, x2, y2, z2);
              }
            }

            const filteredEdgesGeometry = new THREE.BufferGeometry();
            const filteredEdgesPositions = new Float32Array(newPositions);
            filteredEdgesGeometry.setAttribute('position', new THREE.BufferAttribute(filteredEdgesPositions, 3));

            const line = new THREE.LineSegments(filteredEdgesGeometry, new THREE.LineBasicMaterial({ color: 0 }));
            child.add(line);
          }
        });
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const center = bbox.getCenter(new THREE.Vector3());
        const planeGeometry = new THREE.PlaneGeometry(bbox.max.x - bbox.min.x, bbox.max.z - bbox.min.z);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xD1A45E, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(center.x, bbox.min.y, center.z);

        this.scene.add(plane);
        this.scene.add(gltf.scene);

        //相机俯视
        const { camera } = viewerService.getViewer();
        //计算plane中心点
        camera.position.set(center.x, center.y + 100, center.z);
        camera.lookAt(center);
      })
  }


  /*--------------------------------------- private ------------------------------------------*/



}
export default GlbService;