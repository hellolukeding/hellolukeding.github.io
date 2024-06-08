import * as THREE from "three";
export const init = (container: HTMLDivElement | null) => {
  if (!container) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  const renderer = initRenderer(container);
  const scene = initScene();
  const camera = initCamera();
  const light = initLight();
  scene.add(light);
  const geometry = new THREE.BoxGeometry(20, 20, 20);

  const materials = [
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
  ];
  const mesh = new THREE.Mesh(geometry, materials);
  scene.add(mesh);

  // Create an edges geometry from the cube geometry
  const edges = new THREE.EdgesGeometry(mesh.geometry);

  // Create a line segments object with the edges geometry and a basic material
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff }) // Set the color of the lines
  );

  mesh.add(line);

  renderer.render(scene, camera);
  const animate = () => {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
};

/*--------------------------------------- renderer ------------------------------------------*/
export const initRenderer = (
  container: HTMLDivElement
): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return renderer;
};

/*--------------------------------------- scene ------------------------------------------*/

export const initScene = (): THREE.Scene => {
  return new THREE.Scene();
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
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 0, 1);
  return light;
};
