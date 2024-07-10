import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "github-markdown-css/github-markdown-dark.css";
import { useEffect } from "react";
import { RouterProvider } from "react-router";
import Header from "./components/common/Header";
import "./hljs.css";
import styles from "./index.module.scss";
import { crtRouter } from "./router";
import "./style/index.scss";
export const myQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log(
    "白屏时间",
    window.performance.timing.domLoading -
      window.performance.timing.navigationStart
  );
  console.log(
    "首屏时间",
    window.performance.timing.domInteractive -
      window.performance.timing.navigationStart
  );

  useEffect(() => {
    fetch("https://api.vvhan.com/api/ipInfo")
      .then((res) => res.json())
      .then((res: any) => {
        console.log(
          `用户来自${res?.info?.country}${res?.info?.prov}${res?.info?.city},运营商为${res?.info?.isp}`
        );
        console.log(`IP:${res?.ip}`);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);
  return (
    <div className={styles.app}>
      <QueryClientProvider client={myQueryClient}>
        <ReactQueryDevtools initialIsOpen={window.config.ENV === "dev"} />
        <Header />
        <article className={styles["content"]}>
          <RouterProvider router={crtRouter} />
        </article>
      </QueryClientProvider>
      {/* <ThemeChanger /> */}
    </div>
  );
}

export default App;
