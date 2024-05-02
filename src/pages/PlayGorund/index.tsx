import { useState } from "react";
import Editor from "src/components/Editor";
import Previewer from "src/components/Previewer";
import styles from "./index.module.scss";
interface PlayGroundProps {}
const PlayGround: React.FC<PlayGroundProps> = (props) => {
  const [code, setCode] = useState<string>("");

  const handleCodeChange = (code: string) => {
    setCode(code);
  };

  return (
    <section className={styles["playground"]}>
      <article className={styles["left-editor"]}>
        <Editor
          className={styles["editor"]}
          onChange={(val) => {
            val && handleCodeChange(val);
          }}
          onMounted={(code) => {
            setCode(code);
          }}
        />
      </article>
      <article className={styles["preview-panel"]}>
        <Previewer code={code} />
      </article>
    </section>
  );
};

export default PlayGround;
