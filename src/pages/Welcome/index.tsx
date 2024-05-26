import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { runShader } from "./runShader";
interface WelcomeProps {}
const Welcome: React.FC<WelcomeProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const str = `Welcome to visit my blog!`;
  useEffect(() => {
    runShader(canvasRef);
  }, []);
  return (
    <>
      <canvas className={styles.wel} ref={canvasRef}></canvas>

      <p className={styles["slogan"]}>{str}</p>
    </>
  );
};

export default Welcome;
