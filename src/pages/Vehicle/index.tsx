import { useEffect, useRef } from "react";
import PhysicsService from "src/service/PhysicsService";
import ViewerService from "src/service/ViewerService";
import styles from "./index.module.scss";
interface VehicleProps {}

const Vehicle: React.FC<VehicleProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewerService = new ViewerService(ref.current);
    viewerService.init();
    const physicsService = new PhysicsService(viewerService.getViewer().scene);
    viewerService.physics2do(physicsService);
  }, []);
  return <div className={styles.main} ref={ref}></div>;
};

export default Vehicle;
