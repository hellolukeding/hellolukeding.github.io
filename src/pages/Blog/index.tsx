//@ts-nocheck
import Card from "src/components/common/Card";
import styles from "./index.module.scss";
interface BlogProps {}

const Blog: React.FC<BlogProps> = (props) => {
  return (
    <article className={styles.blog}>
      {Object.keys(window.config.blogs).map((item) => {
        return <Card yr={item} key={item} />;
      })}
    </article>
  );
};

export default Blog;
