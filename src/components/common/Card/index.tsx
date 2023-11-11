import styles from "./index.module.scss";
interface CardProps {
  yr: string;
}

const Card: React.FC<CardProps> = (props) => {
  return <article className={styles["card"]}>{props.yr}</article>;
};

export default Card;
