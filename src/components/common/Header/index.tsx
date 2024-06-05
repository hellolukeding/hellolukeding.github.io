import React, { useEffect, useRef } from "react";
import { crtRouter } from "src/router";
import { classNames } from "src/utils/classNames";

import { key2NodeMP, rightMenu } from "./data";
import styles from "./index.module.scss";

const Header: React.FC = () => {
  const [active, setActive] = React.useState<string>(
    window.location.hash.slice(2)
  );
  const [hoverActive, setHoverActive] = React.useState<string>("");
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setActive(window.location.hash.split("/").slice(1)[0]);
  }, []);
  return (
    <header className={styles.header}>
      <span
        className={styles.logo}
        onClick={(e) => {
          e.stopPropagation();
          crtRouter.navigate("/welcome");
        }}
      >
        lukeding
      </span>

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
                  if (item.father) return;
                  e.stopPropagation();
                  crtRouter.navigate(item.navi, { replace: true });
                  setActive(item.key);
                })
              }
              onPointerEnter={() => {
                setHoverActive(item.key);
              }}
            >
              {item.icon}
              <b>{item.name}</b>
              {hoverActive === item.key && item.father && (
                <section className={styles["subnode-container"]}>
                  {key2NodeMP.get(item.key)?.map((subnode) => {
                    return (
                      <nav
                        key={item.key + subnode.key}
                        className={styles["subnode-item"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          crtRouter.navigate(subnode.navi, { replace: true });
                          setActive(item.key);
                          setHoverActive("");
                        }}
                      >
                        {subnode.icon}
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
