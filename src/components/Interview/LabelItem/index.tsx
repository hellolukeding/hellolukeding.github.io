import { useState } from "react";
import { classNames } from "src/utils/classNames";
import TitleItem from "../TileItem";
import { MaterialSymbolsChevronLeftRounded } from "./icons";
import styles from "./index.module.scss";
interface LabelItemProps {
  color: string;
  default: boolean;
  description: string;
  id: number;
  name: string;
  node_id: string;
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

const LabelItem: React.FC<LabelItemProps> = (props) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((open) => !open);
  };
  return (
    <section
      className={classNames(styles.main, props.className ?? "")}
      style={props.style}
    >
      <p
        style={{
          color: !open ? `#${props.color}` : "#fff",
          background: open ? `#${props.color}` : "",
        }}
        className={classNames(styles.name, !open ? styles["label-active"] : "")}
        onClick={handleClick}
      >
        {props.description}

        <MaterialSymbolsChevronLeftRounded
          className={!open ? styles["icon-default"] : styles["icon-active"]}
        />
      </p>

      <article
        className={styles.content}
        style={{
          height: open ? "auto" : 0,
          overflow: open ? "auto" : "hidden",
        }}
      >
        {open && <TitleItem labels={[props.name]} color={props.color} />}
      </article>
    </section>
  );
};

export default LabelItem;
