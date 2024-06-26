export {};

export interface MenuItem {
  name: string;
  description?: string;
  init: (container: HTMLDivElement | null) => void;
  destroy: () => void;
}
