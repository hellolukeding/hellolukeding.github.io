import * as THREE from "three";
import viewerService from "./ViewerService";
class ArrowService{

  public createArrow(
    start:THREE.Vector3,
    end:THREE.Vector3,
    color:number,
    lineWidth:number
  ){
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const arrow = this.createArrowFactor(end, direction, length, lineWidth, color);
    viewerService.getViewer().scene.add(arrow);
  }


  private createArrowFactor(start:THREE.Vector3,direction:THREE.Vector3,length:number,width:number,color:number){
    const arrowGroup = new THREE.Group();

    // 创建箭头头部（圆锥）
    const coneGeometry = new THREE.ConeGeometry(width, length * 0.2, 32);
    const coneMaterial = new THREE.MeshBasicMaterial({ color });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.y = length * 0.1;
    arrowGroup.add(cone);

    // 创建箭头杆（圆柱）
    const cylinderGeometry = new THREE.CylinderGeometry(width * 0.2, width * 0.2, length * 0.8, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.y = -length * 0.4;
    arrowGroup.add(cylinder);

    // 设置箭头的位置
    arrowGroup.position.copy(start);
    // 设置箭头的方向
    arrowGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

    return arrowGroup;
  }
}

export default ArrowService;