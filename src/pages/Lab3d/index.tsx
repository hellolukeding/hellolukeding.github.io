import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { commonInit } from "./scripts/init";
interface GltfViewerProps {}

const Lab3D: React.FC<GltfViewerProps> = (props) => {
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    commonInit(mainRef.current);
  }, []);
  return <article className={styles["main"]} ref={mainRef}></article>;
};

export default Lab3D;
