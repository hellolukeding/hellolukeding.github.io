import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router";
import Header from "./components/common/Header";
import styles from "./index.module.scss";
import { crtRouter } from "./router";
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
