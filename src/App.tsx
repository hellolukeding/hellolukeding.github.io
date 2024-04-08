import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "github-markdown-css/github-markdown-dark.css";
import { RouterProvider } from "react-router";
import Header from "./components/common/Header";
import "./hljs.css";
import styles from "./index.module.scss";
import { crtRouter } from "./router";
import "./style/index.scss";
export const myQueryClient = new QueryClient();

function App() {
  return (
    <div className={styles.app}>
      <QueryClientProvider client={myQueryClient}>
        <ReactQueryDevtools initialIsOpen={window.config.ENV === "dev"} />
        <Header />
        <article className={styles["content"]}>
          <RouterProvider router={crtRouter} />
        </article>
      </QueryClientProvider>
    </div>
  );
}

export default App;
