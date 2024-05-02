import Editor from "src/components/Editor";
import styles from "./index.module.scss";
interface PlayGroundProps {}
const PlayGround: React.FC<PlayGroundProps> = (props) => {
  const handleCodeChange = (code: string) => {
    console.log(code);
  };

  return (
    <section className={styles["playground"]}>
      <article className={styles["left-editor"]}>
        <Editor
          className={styles["editor"]}
          onChange={(val) => {
            val && handleCodeChange(val);
          }}
        />
      </article>
      <article className={styles["preview-panel"]}></article>
    </section>
  );
};

export default PlayGround;
