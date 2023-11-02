import React from "react";
import { crtRouter } from "src/router";
import { classNames } from "src/utils/classNames";
import {
  BxsMoviePlay,
  EmojioneV1StatueOfLiberty,
  FluentMusicNote2Play20Filled,
  NotoV1VideoGame,
  OcticonTools,
  SystemUiconsDocumentStack,
} from "./icons";
import styles from "./index.module.scss";

const Header: React.FC = () => {
  const [active, setActive] = React.useState<string>(
    window.location.hash.slice(2)
  );

  return (
    <header className={styles.header}>
      <span className={styles.logo}>lukeding</span>

      <span className={styles.icon}>
        {rightMenu.map((item) => {
          return (
            <span
              key={item.name}
              className={classNames(
                styles["item"],
                item.key === active ? styles["active-item"] : ""
              )}
              onClick={(e) => {
                e.stopPropagation();
                crtRouter.navigate(item.navi, { replace: true });
                setActive(item.key);
              }}
            >
              {item.icon}
              <b>{item.name}</b>
            </span>
          );
        })}
      </span>
    </header>
  );
};

export default Header;

const rightMenu = [
  {
    name: "博客",
    icon: <SystemUiconsDocumentStack />,
    navi: "#",
    key: "blog",
  },
  {
    name: "IT工具集",
    icon: <OcticonTools />,
    navi: "#",
    key: "toolkit",
  },
  {
    name: "电影",
    icon: <BxsMoviePlay />,
    navi: "#",
    key: "movie",
  },
  {
    name: "音乐",
    icon: <FluentMusicNote2Play20Filled />,
    navi: "/music",
    key: "music",
  },
  {
    name: "云旅游",
    icon: <EmojioneV1StatueOfLiberty />,
    navi: "/libary",
    key: "libary",
  },
  {
    name: "玩游戏",
    icon: <NotoV1VideoGame />,
    navi: "/game",
    key: "game",
  },
];
