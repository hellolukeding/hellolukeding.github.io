import styles from "./index.module.scss";
interface GameProps {}

const Game: React.FC<GameProps> = (props) => {
  return (
    <iframe
      src="https://v6p9d9t4.ssl.hwcdn.net/html/5185382/index.html"
      frameBorder="0"
      className={styles["music"]}
      title="game"
    ></iframe>
  );
};

export default Game;
