import styles from "./index.module.scss";
interface BlogCardProps {
  yr: string;
}

const BlogCard: React.FC<BlogCardProps> = (props) => {
  return (
    <article className={styles["BlogCard"]}>
      <h3 className={styles["neon"]}>{props.yr}</h3>
      <section className={styles["content"]}>
        {(window.config.blogs[props.yr] ?? []).map((item) => {
          return (
            <div key={item} className={styles["blog"]}>
              {item}
            </div>
          );
        })}
      </section>
    </article>
  );
};

export default BlogCard;
