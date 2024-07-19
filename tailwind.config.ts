import type { Config } from "tailwindcss";
import Colors from "./.tailwind/Colors";
const config: Config = {
  presets: [
    require("./.tailwind/animation.config")
  ],
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dance: ['Dancing Script', 'sans-serif'], // 定义一个新的字体族
      },
      colors: {
        "primary":{
          "dark": Colors.dark,
          "light": Colors.light,
        }
      },
      backgroundColor: {
        "primary": {
          "dark": Colors.dark,
          "light": Colors.light,
        }
      },
      backgroundImage: {
        'custom-grid': `linear-gradient(to right, black 1px, transparent 1px),
                        linear-gradient(to bottom, black 1px, transparent 1px),
                        linear-gradient(to right, #404040 1px, transparent 1px),
                        linear-gradient(to bottom, #404040 1px, transparent 1px)`,
      },
      backgroundSize: {
        'custom-grid': '100px 100px, 100px 100px, 10px 10px, 10px 10px',
      },
    },
  },
  plugins: [
  ],
};
export default config;
