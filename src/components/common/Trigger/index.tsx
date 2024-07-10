import { classNames } from "src/utils/classNames";
import { GameIconsPauseButton, PhPlayFill } from "./icons";
import styles from "./index.module.scss";
interface TriggerProps {
  play: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Trigger: React.FC<TriggerProps> = (props) => {
  return (
    <span
      className={classNames(styles.trigger, props?.className ?? "")}
      style={props?.style}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick && props.onClick();
      }}
    >
      {props.play ? <PhPlayFill /> : <GameIconsPauseButton />}
    </span>
  );
};

export default Trigger;
