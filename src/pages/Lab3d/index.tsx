import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { init } from "./scripts/init";
interface GltfViewerProps {}

const GltfViewer: React.FC<GltfViewerProps> = (props) => {
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    init(mainRef.current);
  }, []);
  return <article className={styles["main"]} ref={mainRef}></article>;
};

export default GltfViewer;
