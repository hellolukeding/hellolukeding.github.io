import { useNavigate } from "react-router";
import styles from "./index.module.scss";
interface BlogCardProps {
  yr: string;
  style?: React.CSSProperties;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = (props) => {
  const navigate = useNavigate();
  return (
    <article
      className={styles["BlogCard"] + " " + (props.className ?? "")}
      style={props.style}
    >
      <h3 className={styles["neon"]}>{props.yr}</h3>
      <section className={styles["content"]}>
        {(window.config.blogs[props.yr] ?? []).map((item) => {
          return (
            <div
              key={item}
              className={styles["blog"]}
              onClick={() => {
                navigate(`/blog/content/${props.yr}/${item}`);
              }}
            >
              {item}
            </div>
          );
        })}
      </section>
    </article>
  );
};

export default BlogCard;
