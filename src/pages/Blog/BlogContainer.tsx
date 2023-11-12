import { Outlet } from "react-router";
import styles from "./index.module.scss";
interface BlogContainerProps {}

const BlogContainer: React.FC<BlogContainerProps> = (props) => {
  return (
    <div className={styles["bc"]}>
      <Outlet />
    </div>
  );
};

export default BlogContainer;
