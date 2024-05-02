import React from "react";
import { crtRouter } from "src/router";
import { classNames } from "src/utils/classNames";
import {
  CarbonDataBlob,
  FluentMusicNote2Play20Filled,
  GameIconsThunderBlade,
  MdiBed,
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
            </span>
          );
        })}
      </span>
    </header>
  );
};

export default Header;

interface MenuItem {
  name: string;
  icon: JSX.Element;
  navi: string;
  key: string;
  handleClick?: React.MouseEventHandler<HTMLSpanElement>;
}
const rightMenu: MenuItem[] = [
  {
    name: "博客",
    icon: <SystemUiconsDocumentStack />,
    navi: "/blog",
    key: "blog",
  },
  {
    name: "IT工具集",
    icon: <OcticonTools />,
    navi: "/toolkit",
    key: "toolkit",
  },
  {
    name: "图床",
    icon: <MdiBed />,
    navi: "/imgbed",
    key: "imgbed",
  },
  {
    name: "音乐",
    icon: <FluentMusicNote2Play20Filled />,
    navi: "/music",
    key: "music",
  },
  {
    name: "竞技场",
    icon: <GameIconsThunderBlade />,
    navi: "/playground",
    key: "playground",
  },
  {
    name: "Carbon",
    icon: <CarbonDataBlob />,
    navi: "#",
    key: "carbon",
    handleClick: (e) => {
      e.preventDefault();
      window.open("https://carbon.now.sh/");
    },
  },
  {
    name: "玩游戏",
    icon: <NotoV1VideoGame />,
    navi: "/game",
    key: "game",
  },
];
