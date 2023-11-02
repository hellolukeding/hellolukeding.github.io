import styles from "./index.module.scss";
interface LibaryProps {}

const Libary: React.FC<LibaryProps> = (props) => {
  return (
    <iframe
      src="https://virtual.mauritshuis.nl/index.html?lang=en&startscene=21"
      frameBorder="0"
      className={styles["music"]}
      title="libary"
    ></iframe>
  );
};

export default Libary;
