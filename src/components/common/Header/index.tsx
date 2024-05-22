import React, { useEffect, useRef } from "react";
import { crtRouter } from "src/router";
import { classNames } from "src/utils/classNames";

import { key2NodeMP, rightMenu } from "./data";
import styles from "./index.module.scss";

const Header: React.FC = () => {
  const [active, setActive] = React.useState<string>(
    window.location.hash.slice(2)
  );
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hoverHandler = (e: MouseEvent) => {
      const dataset = (e.target as HTMLElement).dataset;
      console.log(dataset);
    };
    spanRef.current?.addEventListener("mousemove", hoverHandler);
  }, []);

  return (
    <header className={styles.header}>
      <span className={styles.logo}>lukeding</span>

      <span className={styles.icon} ref={spanRef}>
        {rightMenu.map((item) => {
          return (
            <span
              key={item.name}
              className={classNames(
                styles["item"],
                item.key === active ? styles["active-item"] : ""
              )}
              data-key={item.key}
              onClick={
                item.handleClick ??
                ((e) => {
                  e.stopPropagation();
                  crtRouter.navigate(item.navi, { replace: true });
                  setActive(item.key);
                })
              }
            >
              {item.icon}
              <b>{item.name}</b>
              {item.father && (
                <section className={styles["subnode-container"]}>
                  {key2NodeMP.get(item.key)?.map((subnode) => {
                    return (
                      <nav
                        key={item.key + subnode.key}
                        className={styles["subnode-item"]}
                      >
                        {subnode.name}
                      </nav>
                    );
                  })}
                </section>
              )}
            </span>
          );
        })}
      </span>
    </header>
  );
};

export default Header;
