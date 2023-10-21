import React from "react";
import { socialMedia } from "./data";
import styles from "./index.module.scss";
const Header: React.FC = () => {
  return <header className={styles.header}>
    <span className={styles.logo}>
      lukeding
    </span>

    <span className={styles.icon}>
      {socialMedia.map(item=>{
        return (
          <React.Fragment key={item.url}>
            {item.icon}
          </React.Fragment>
        )
      })}
    </span>
  </header>
};

export default Header;
