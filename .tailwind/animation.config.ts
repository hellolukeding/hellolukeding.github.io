import type { Config } from "tailwindcss";

const config: Config = {
  content: [],
  theme: {
    extend: {
      animation: {
        "fadeIn": "fadeIn 0.5s ease-in-out forwards"
      },
      keyframes: {
        "fadeIn":{
          "from":{
            "opacity": "0",
            "transform": "translate3d(0, 100%, 0)"
          },
          "to":{
            "opacity": "1",
            "transform": "translate3d(0, 0, 0)"
          }
        }
      }
    },
  },
  plugins: [],
};

export default config;