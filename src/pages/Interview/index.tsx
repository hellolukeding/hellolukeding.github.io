import { Suspense, useDeferredValue } from "react";
import { useGithubIssueLabels } from "src/apis/query/github";
import { useGithubIssueLabelsResults } from "src/apis/query/github/types";
import LabelItem from "src/components/Interview/LabelItem";
import Loading from "src/components/common/Loading";
import styles from "./index.module.scss";
interface InterviewProps {}

const Interview: React.FC<InterviewProps> = (props) => {
  // const { data } = useGithubIssue();
  // console.log(data);
  const { data } = useGithubIssueLabels();
  const labels = (useDeferredValue(data) as any) as
    | useGithubIssueLabelsResults
    | undefined;
  return (
    <section className={styles.main}>
      <aside className={styles["side"]}>
        <Suspense fallback={<Loading />}>
          {(labels?.data ?? []).map((label) => {
            return <LabelItem key={label.id} {...label} />;
          })}
        </Suspense>
      </aside>
      <article className={styles["content"]}></article>
    </section>
  );
};

export default Interview;
