import { Navigate, RouteObject, createHashRouter } from "react-router-dom";
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
];

export const crtRouter = createHashRouter(routers);
