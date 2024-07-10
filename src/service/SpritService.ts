import { getPosInScene } from "src/utils/threeHelper";
import * as THREE from "three";
import viewerService from "./ViewerService";

class SpritService {
  private spritMap: Map<string, THREE.Sprite> = new Map();

  /*--------------------------------------- common ------------------------------------------*/
  public click2do(
    cb: (
      point: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>
    ) => void
  ) {
    window.addEventListener("click", (e) => getPosInScene()(e, cb), false);
  }

  public dispose(
    cb: (
      point: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>
    ) => void
  ) {
    window.removeEventListener("click", (e) => {
      getPosInScene()(e, cb);
    });
  }

  public createSprit(pos: THREE.Vector3, url: string) {
    try {
      const map = new THREE.TextureLoader().load(url);
      console.log(map, "map");
      const material = new THREE.SpriteMaterial({ map: map, depthTest: false });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(pos);
      sprite.scale.set(5, 5, 5);
      sprite.userData = {
        type: "billboard",
      };
      viewerService.getViewer().scene.add(sprite);
    } catch (e) {
      console.error("创建标签失败！");
    }
  }
  /*--------------------------------------- private ------------------------------------------*/
}

export default SpritService;
