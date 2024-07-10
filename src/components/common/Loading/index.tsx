import { classNames } from "src/utils/classNames";
import { EosIconsThreeDotsLoading } from "./icons";
import styles from "./index.module.scss";
interface LoadingProps {
  className?: string;
  style?: React.CSSProperties;
}

const Loading: React.FC<LoadingProps> = (props) => {
  return (
    <article
      className={classNames(styles["loading"], props?.className ?? "")}
      style={props?.style}
    >
      <EosIconsThreeDotsLoading />
    </article>
  );
};

export default Loading;
