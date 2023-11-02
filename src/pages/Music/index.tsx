import styles from "./index.module.scss";
interface MusicProps {}

const Music: React.FC<MusicProps> = (props) => {
  return (
    <iframe
      src="https://music.ishkur.com/"
      frameBorder="0"
      className={styles["music"]}
      title="music"
    ></iframe>
  );
};

export default Music;
