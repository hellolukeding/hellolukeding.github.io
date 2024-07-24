import type { Config } from "tailwindcss";

const config: Config = {
  content: [],
  theme: {
    extend: {
      animation: {
        "fadeIn": "fadeIn 3s ease-in-out forwards",
        "moveDown": "moveDown 2s ease-in-out infinite"
      },
      keyframes: {
        "fadeIn":{
          "0%":{
            "opacity": "0",
            "transform": "translate3d(0, 100%, 0)"
          },
          "90%":{
            "opacity": "0.5",
            "transform": "translate3d(0, 0, 0)"
          },
          "100%":{
            "opacity": "1",
            "transform": "translate3d(0, 0, 0)"
          }
        },
        "moveDown":{
          "0%":{
            "transform": "translateY(-100%)",
            "opacity": "0"
          },
 
          "100%":{
            "transform": "translateY(0)",
            "opacity": "1"
          }
        }
      }
    },
  },
  plugins: [],
};

export default config;