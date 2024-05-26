import { useGithubIssue } from "src/apis/query/github";
import styles from "./index.module.scss";
interface InterviewProps {}

const Interview: React.FC<InterviewProps> = (props) => {
  const { data } = useGithubIssue();
  console.log(data);
  return (
    <section className={styles.main}>
      <aside className={styles["side"]}></aside>
      <article className={styles["content"]}></article>
    </section>
  );
};

export default Interview;
