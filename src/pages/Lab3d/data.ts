import { init } from "./scripts/init";

export {};

export interface MenuItem {
  name: string;
  description?: string;
  init: (container: HTMLDivElement | null) => void;
  destroy: () => void;
}

export const menus: MenuItem[] = [
  {
    name: "旋转行星",
    description: "旋转行星",
    init: init,
    destroy: () => {},
  },
];
