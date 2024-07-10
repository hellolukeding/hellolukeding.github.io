import React, { useEffect } from "react";
import styles from "./index.module.scss";
import { init } from "./init";

interface GLTFViewerProps {}

const GLTFViewer: React.FC<GLTFViewerProps> = (props) => {
  const readerRef = React.useRef<HTMLDivElement>(null);
  const [dragged, setDragged] = React.useState(false);
  useEffect(() => {
    const dragoverHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      //@ts-ignore
      e.dataTransfer.dropEffect = "copy";
    };

    const dropHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      //@ts-ignore
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          console.log(result, "result");
          dispose();
          setDragged(true);
          init(readerRef.current, result as ArrayBuffer);
          // initGLTFLoader(scene, result);
          // if (typeof result === "string") {
          //   const gltf = JSON.parse(result);
          //   dispose();
          //   setDragged(true);
          //   init(readerRef.current, gltf);
          // }
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const dispose = () => {
      readerRef.current?.removeEventListener("dragover", dragoverHandler);
      readerRef.current?.removeEventListener("drop", dropHandler);
    };
    readerRef.current?.addEventListener("dragover", dragoverHandler);
    readerRef.current?.addEventListener("drop", dropHandler);
    return () => {
      dispose();
    };
  }, []);
  return (
    <section className={styles.main} ref={readerRef}>
      {!dragged && (
        <article className={styles["drag-tip"]}>Drag GLTF file here</article>
      )}
    </section>
  );
};

export default GLTFViewer;
