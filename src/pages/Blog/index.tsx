//@ts-nocheck
import Card from "src/components/common/Card";
import styles from "./index.module.scss";
interface BlogProps {}

const Blog: React.FC<BlogProps> = (props) => {
  return (
    <article className={styles.blog}>
      {Object.keys(window.config.blogs)
        .reverse()
        .map((item, index) => {
          return (
            <Card
              yr={item}
              key={item}
              style={index === 0 ? { marginTop: 50 } : {}}
            />
          );
        })}
    </article>
  );
};

export default Blog;
