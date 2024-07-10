import styles from "./index.module.scss";
interface GameProps {}

const Game: React.FC<GameProps> = (props) => {
  return (
    <iframe
      src="https://html5games.com/"
      frameBorder="0"
      className={styles["music"]}
      title="game"
    ></iframe>
  );
};

export default Game;
