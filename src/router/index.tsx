import { Navigate, RouteObject, createHashRouter } from "react-router-dom";
import Blog from "src/pages/Blog";
import BlogContainer from "src/pages/Blog/BlogContainer";
import RenderMD from "src/pages/Blog/RenderMD";
import GLTFViewer from "src/pages/GLTFViewer";
import Game from "src/pages/Game";
import ImgBed from "src/pages/ImgBed";
import Interview from "src/pages/Interview";
import Lab3d from "src/pages/Lab3d";
import Music from "src/pages/Music";
import PlayGround from "src/pages/PlayGorund";
import ToolKit from "src/pages/ToolKit";
import Welcome from "src/pages/Welcome";

const routers: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="/welcome" replace={true} />,
  },
  {
    path: "welcome",
    element: <Welcome />,
    handle: {
      title: "欢迎页",
    },
  },
  {
    path: "toolkit",
    element: <ToolKit />,
    handle: {
      title: "工具集",
    },
  },
  {
    path: "toolkit/workflow",
    element: <ToolKit />,
    handle: {
      title: "工作流",
    },
  },
  {
    path: "toolkit/3dlab",
    element: <Lab3d />,
    handle: {
      title: "3dlab",
    },
  },
  {
    path: "toolkit/mindmap",
    element: <ToolKit />,
    handle: {
      title: "思维导图",
    },
  },
  {
    path: "toolkit/gltfviewer",
    element: <GLTFViewer />,
    handle: {
      title: "GLTFViewer",
    },
  },
  /*---------------------------------------  ------------------------------------------*/
  {
    path: "blog",
    element: <BlogContainer />,
    handle: {
      title: "博客",
    },
    children: [
      {
        path: "",
        element: <Navigate to="/blog/catalogue" replace={true} />,
      },
      {
        path: "catalogue",
        element: <Blog />,
        handle: {
          title: "目录",
        },
      },
      {
        path: "content/:yr/:md",
        element: <RenderMD />,
        handle: {
          title: "内容",
        },
      },
    ],
  },
  {
    path: "music",
    element: <Music />,
    handle: {
      title: "音乐",
    },
  },
  // {
  //   path: "libary",
  //   element: <Libary />,
  //   handle: {
  //     title: "云旅游",
  //   },
  // },
  {
    path: "playground",
    element: <PlayGround />,
    handle: {
      title: "竞技场",
    },
  },
  {
    path: "game",
    element: <Game />,
    handle: {
      title: "游戏",
    },
  },
  {
    path: "imgbed",
    element: <ImgBed />,
    handle: {
      title: "图床",
    },
  },
  {
    path: "interview",
    element: <Interview />,
    handle: {
      title: "面试题",
    },
  },
];

export const crtRouter = createHashRouter(routers);
