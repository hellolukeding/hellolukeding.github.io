import { useState } from "react";
import Editor from "src/components/Editor";
import Previewer from "src/components/Previewer";
import Trigger from "src/components/common/Trigger";
import styles from "./index.module.scss";
interface PlayGroundProps {}
const PlayGround: React.FC<PlayGroundProps> = (props) => {
  const [code, setCode] = useState<string>("");
  const [commitCode, setCommitCode] = useState<string>("");
  const [trigger, setTrigger] = useState<boolean>(false);

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
            setTrigger(true);
          }}
          onMounted={(code) => {
            setCode(code);
          }}
        />

        <Trigger
          play={trigger}
          className={styles.trigger}
          onClick={() => {
            setCommitCode(code);
          }}
        />
      </article>
      <article className={styles["preview-panel"]}>
        <Previewer code={commitCode} />
      </article>
    </section>
  );
};

export default PlayGround;
