import styles from "./index.module.scss";
interface WelcomeProps {}
const Welcome: React.FC<WelcomeProps> = () => {
  return (
    <>
      <section className={styles.wel}>
        <img
          src="https://cdn.ipfsscan.io/ipfs/Qmeu9wSYJRYF4FTa6En5zznCBPz6dZaYEq3vjCX7qiBgVY?filename=image.png"
          alt=""
        />
        <p>welcome to my blog🤞!</p>
      </section>
    </>
  );
};

export default Welcome;
