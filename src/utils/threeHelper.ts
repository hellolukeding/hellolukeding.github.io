import viewerService from "src/service/ViewerService";
import * as THREE from "three";

/**
 * @description 获取场景中的位置
 */
export const getPosInScene = () => {
  const onMouseClick = (
    e: MouseEvent,
    cb?: (
      point: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>
    ) => void
  ) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const { camera, scene } = viewerService.getViewer();
    // 将鼠标点击位置转换到标准化设备坐标 (NDC) 空间 (-1 to +1)
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    // 更新射线
    raycaster.setFromCamera(mouse, camera);

    // 计算物体与射线的交点
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      cb && cb(intersects[0]);
    }
  };

  return onMouseClick;
};
