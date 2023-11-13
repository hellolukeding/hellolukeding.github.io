import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";
import mdRender from "src/service/mdRender";
import "./index.scss";
interface RenderMDProps {}

const RenderMD: React.FC<RenderMDProps> = (props) => {
  const aref = useRef<HTMLIFrameElement>(null);
  const { yr, md } = useParams();
  const { data: mddata } = useQuery({
    queryKey: ["blog", yr, md],
    queryFn: async () => {
      const res = await fetch(`/md/${yr}/${md}.md`);
      const text = await res.text();
      return text;
    },
  });

  useEffect(() => {
    if (aref.current) {
      aref.current.innerHTML = new mdRender().render(mddata ?? "");
    }
  }, [mddata]);

  return (
    // <iframe
    //   srcDoc={new mdRender().render(mddata ?? "")}
    //   title={(yr ?? "") + (md ?? "")}
    //   className={styles["mdrender"]}
    //   ref={iref}
    // ></iframe>
    <>
      <article ref={aref} className={"markdown-body mdrender"} />
    </>
  );
};

export default RenderMD;
