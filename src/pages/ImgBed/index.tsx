import styles from "./index.module.scss";
interface ImgBedProps {}

const ImgBed: React.FC<ImgBedProps> = (props) => {
  return (
    <iframe
      src="https://cdn.ipfsscan.io"
      frameBorder="0"
      className={styles["music"]}
      title="imgbed"
    ></iframe>
  );
};

export default ImgBed;
