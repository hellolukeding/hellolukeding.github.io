import { Suspense, useDeferredValue } from "react";
import { useGithubIssueLabels } from "src/apis/query/github";
import Loading from "src/components/common/Loading";
import styles from "./index.module.scss";
interface InterviewProps {}

const Interview: React.FC<InterviewProps> = (props) => {
  // const { data } = useGithubIssue();
  // console.log(data);
  const { data } = useGithubIssueLabels();
  const labels = useDeferredValue(data);
  console.log(labels);
  return (
    <section className={styles.main}>
      <aside className={styles["side"]}>
        <Suspense fallback={<Loading />}></Suspense>
      </aside>
      <article className={styles["content"]}></article>
    </section>
  );
};

export default Interview;
