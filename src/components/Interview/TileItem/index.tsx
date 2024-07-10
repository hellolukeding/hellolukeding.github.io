import { Suspense, useDeferredValue } from "react";
import { useGithubIssueByLabel } from "src/apis/query";
import { useGithubIssueByLabelResult } from "src/apis/query/github/types";
import Loading from "src/components/common/Loading";
import styles from "./index.module.scss";
interface TitleItemProps {
  labels: string[];
  color: string;
}

const TitleItem: React.FC<TitleItemProps> = (props) => {
  const { data } = useGithubIssueByLabel(...props.labels);
  const labels = useDeferredValue(data) as
    | useGithubIssueByLabelResult
    | undefined;

  return (
    <article className={styles.main}>
      <Suspense fallback={<Loading />}>
        {labels?.data.map((title) => {
          return (
            <nav key={title.id} className={styles.title} style={{}}>
              {title.title}
            </nav>
          );
        })}
      </Suspense>
    </article>
  );
};

export default TitleItem;
