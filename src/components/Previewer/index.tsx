import { transform } from "@babel/standalone";
import { useCallback } from "react";
import styles from "./index.module.scss";
interface PreviewerProps {
  code: string;
}

const Previewer: React.FC<PreviewerProps> = (props) => {
  const compileCode = useCallback(() => {
    const res = transform(props.code, {
      presets: ["react", "typescript"],
      filename: "luke.tsx",
    });
    return res;
  }, [props.code]);

  console.log(compileCode().code);
  return (
    <iframe src="" frameBorder="0" title="Preview" className={styles.preview} />
  );
};

export default Previewer;
