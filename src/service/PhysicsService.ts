import * as CANNON from "cannon-es";

class PhysicsService {
  private world: CANNON.World;

  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase(); //碰撞检测
  }
}

export default PhysicsService;
