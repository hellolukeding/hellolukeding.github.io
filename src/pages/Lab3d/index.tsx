import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import ViewerService from "./scripts/ViewerService";
interface GltfViewerProps {}

const Lab3D: React.FC<GltfViewerProps> = (props) => {
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mainRef.current) return;
    const viewerService = new ViewerService(mainRef.current);
    viewerService.init();
    return () => {
      viewerService.destroy();
    };
  }, []);
  return <article className={styles["main"]} ref={mainRef}></article>;
};

export default Lab3D;
