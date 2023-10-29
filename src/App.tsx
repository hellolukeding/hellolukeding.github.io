import { RouterProvider } from "react-router";
import Header from "./components/common/Header";
import styles from "./index.module.scss";
import { crtRouter } from "./router";
function App() {
  return (
    <div className={styles.app}>
      <Header />
      <article className={styles["content"]}>
        <RouterProvider router={crtRouter} />
      </article>
    </div>
  );
}

export default App;
