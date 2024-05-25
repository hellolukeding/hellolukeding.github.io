import {
  CarbonDataBlob,
  FluentMusicNote2Play20Filled,
  GameIconsThunderBlade,
  MaterialSymbolsMapOutlineSharp,
  MdiBed,
  NotoV1VideoGame,
  OcticonTools,
  PhFlowArrowDuotone,
  SolarMaskHapplyBroken,
  SystemUiconsDocumentStack,
} from "./icons";
export interface MenuItem {
  name: string;
  icon: JSX.Element;
  navi: string;
  key: string;
  handleClick?: React.MouseEventHandler<HTMLSpanElement>;
  father?: boolean; //是否为父级目录
}

export const rightMenu: MenuItem[] = [
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
    father: true,
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
    name: "面试题",
    icon: <SolarMaskHapplyBroken />,
    navi: "/interview",
    key: "interview",
  },
  {
    name: "玩游戏",
    icon: <NotoV1VideoGame />,
    navi: "/game",
    key: "game",
  },
];

/*--------------------------------------- 子节点 ------------------------------------------*/
export const key2NodeMP: Map<string, MenuItem[]> = new Map([
  [
    "toolkit",
    [
      {
        name: "工作流",
        icon: <PhFlowArrowDuotone />,
        navi: "/toolkit/workflow",
        key: "workflow",
      },
      {
        name: "思维导图",
        icon: <MaterialSymbolsMapOutlineSharp />,
        navi: "/toolkit/mindmap",
        key: "mindmap",
      },
    ],
  ],
]);
