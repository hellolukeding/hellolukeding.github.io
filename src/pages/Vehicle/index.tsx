import { useEffect, useRef } from "react";
import ViewerService from "src/service/ViewerService";
import styles from "./index.module.scss";
interface VehicleProps {}

const Vehicle: React.FC<VehicleProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewerService = new ViewerService(ref.current);
    viewerService.init();
  }, []);
  return <div className={styles.main} ref={ref}></div>;
};

export default Vehicle;
