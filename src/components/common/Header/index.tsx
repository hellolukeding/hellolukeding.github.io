import React, { useEffect, useRef, useState } from "react";
import { crtRouter } from "src/router";
import { classNames } from "src/utils/classNames";

import { key2NodeMP, rightMenu } from "./data";
import { MdiMenu } from "./icons";
import styles from "./index.module.scss";

const Header: React.FC = () => {
  const [active, setActive] = React.useState<string>(
    window.location.hash.slice(2)
  );
  const [hoverActive, setHoverActive] = React.useState<string>("");
  const spanRef = useRef<HTMLSpanElement>(null);
  const [collapsed, setIsCollapsed] = useState<boolean>(
    window.innerWidth < 1070
  );
  const [openHiddenMenu, setOpenHiddenMenu] = useState<boolean>(false);

  const changeCollapsed = () => {
    setIsCollapsed(window.innerWidth < 1070);
  };
  useEffect(() => {
    setActive(window.location.hash.split("/").slice(1)[0]);
    window.addEventListener("resize", changeCollapsed);
    return () => {
      window.removeEventListener("resize", changeCollapsed);
    };
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
        {!collapsed &&
          rightMenu.map((item) => {
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

        {collapsed && (
          <MdiMenu
            className={styles.collapse}
            style={{
              color: openHiddenMenu ? "#FFCA3A" : "#fff",
            }}
            onClick={() => {
              setOpenHiddenMenu(!openHiddenMenu);
            }}
          />
        )}
      </span>

      {collapsed && openHiddenMenu && (
        <aside className={styles["hidden-menu"]}>
          <ul className={styles["navi-menu"]}>
            {rightMenu.map((item) => {
              return (
                <React.Fragment key={item.key}>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!key2NodeMP.has(item.key)) {
                        crtRouter.navigate(item.navi);
                        setOpenHiddenMenu(false);
                      }
                    }}
                  >
                    {item.icon} <span>{item.name}</span>
                  </li>

                  {key2NodeMP.get(item.key)?.map((subnode) => {
                    return (
                      <li
                        key={subnode.key}
                        className={styles["navi-menu-subnode"]}
                        onClick={() => {
                          crtRouter.navigate(subnode.navi);
                          setOpenHiddenMenu(false);
                        }}
                      >
                        {subnode.icon} <span>{subnode.name}</span>
                      </li>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </ul>
        </aside>
      )}
    </header>
  );
};

export default Header;
