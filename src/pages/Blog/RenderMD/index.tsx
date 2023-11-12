import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import mdRender from "src/service/mdRender";
import styles from "./index.module.scss";
interface RenderMDProps {}

const RenderMD: React.FC<RenderMDProps> = (props) => {
  const { yr, md } = useParams();
  const { data: mddata } = useQuery({
    queryKey: ["blog", yr, md],
    queryFn: async () => {
      const res = await fetch(`/md/${yr}/${md}.md`);
      const text = await res.text();
      return text;
    },
  });
  return (
    <iframe
      srcDoc={new mdRender().render(mddata ?? "")}
      title={(yr ?? "") + (md ?? "")}
      className={styles["mdrender"]}
    ></iframe>
  );
};

export default RenderMD;
