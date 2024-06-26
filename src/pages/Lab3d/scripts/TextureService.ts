import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { LUTPass } from "three/examples/jsm/postprocessing/LUTPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import ViewerService from "./ViewerService";
class TextureService {
  public static loadSceneTexture(viewer: ViewerService) {
    const { scene, camera } = viewer.getViewer();
    const loader = new THREE.CubeTextureLoader();
    loader.setPath("imgs/texture/bridge/");
    const textureCube = loader.load([
      "posx.jpg",
      "negx.jpg",
      "posy.jpg",
      "negy.jpg",
      "posz.jpg",
      "negz.jpg",
    ]);
    const textureLoader = new THREE.TextureLoader();
    const textureEquirec = textureLoader.load(
      "imgs/texture/2294472375_24a3b8ef46_o.jpg"
    );
    textureEquirec.mapping = THREE.EquirectangularReflectionMapping; // 作用：将纹理映射到球体上
    textureEquirec.colorSpace = THREE.SRGBColorSpace; // 作用：将纹理颜色空间转换为sRGB
    scene.background = textureEquirec;

    //几何体
    const geometry = new THREE.IcosahedronGeometry(1, 15); // icosahedron 二十面体
    const sphereMaterial = new THREE.MeshBasicMaterial({
      envMap: textureEquirec,
    });
    const sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
    sphereMesh.scale.set(100, 100, 100);
    scene.add(sphereMesh);
    // 设置相机位置
    camera.position.set(0, 0, 300); // 将相机向后移动，以确保球体完全在视野内
    //
    camera.lookAt(sphereMesh.position);
    // 更新相机
    camera.updateProjectionMatrix();
  }

  public static postEffect(viewer: ViewerService) {
    const { renderer, scene, camera } = viewer.getViewer();
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const lutPass = new LUTPass({ lut: undefined, intensity: 1 });
    const outputPass = new OutputPass();
    composer.addPass(renderPass);
    composer.addPass(outputPass);
    const animate = () => {
      requestAnimationFrame(animate);
      composer.render();
    };
    return [animate, () => {}];
  }
}

export default TextureService;
