import * as THREE from "three";
export const init = (container: HTMLDivElement | null) => {
  if (!container) return;
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();

  //创建一个长方体几何对象Geometry
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  //创建一个材质对象Material
  const material = new THREE.MeshBasicMaterial({
    color: "#008B8B",
  });
  // 两个参数分别为几何体geometry、材质material
  const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  //设置网格模型在三维空间中的位置坐标，默认是坐标原点
  mesh.position.set(0, 10, 0);
  //网格模型添加到场景中
  scene.add(mesh);

  //创建相机对象
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera();
  //设置相机的位置坐标
  camera.position.set(200, 200, 200);
  camera.lookAt(mesh.position); //指向mesh对应的位置

  //创建渲染器对象
  const renderer = new THREE.WebGLRenderer();
  //设置渲染器的颜色和大小
  renderer.setClearColor("#000000");
  renderer.setSize(width, height);
  //相机绕y轴旋转
  let step = 0;
  //渲染函数
  function render() {
    //网格模型旋转
    mesh.rotateY(0.01);
    //渲染器执行渲染操作
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
  // 相机看向的位置
  camera.lookAt(0, 0, 0);

  //
  renderer.render(scene, camera); //执行渲染操作
  //渲染器渲染场景
  container.appendChild(renderer.domElement);
};
