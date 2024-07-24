import type { Config } from "tailwindcss";

const config: Config = {
  content: [],
  theme: {
    extend: {
      animation: {
        "fadeIn": "fadeIn 3s ease-in-out forwards",
        "moveDown": "moveDown 2s ease-in-out infinite",
        "shakeX": "shakeX 1.2s ease-in-out forwards",
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
        },
        "shakeX":{
          "0%":{
            "transform": "translate3d(0, 0, 0)"
          },
          "100%":{
            "transform": "translate3d(0, 0, 0)"
          },     
          "10% ":{ "transform":" translate3d(-10px, 0, 0)"},
          "30% ":{ "transform":" translate3d(-10px, 0, 0)"},
          "50% ":{ "transform":" translate3d(-10px, 0, 0)"},
          "70% ":{ "transform":" translate3d(-10px, 0, 0)"},
          "90% ":{ "transform":" translate3d(-10px, 0, 0)"},
          "20%":{ "transform":" translate3d(10px, 0, 0)"},
          "40%":{ "transform":" translate3d(10px, 0, 0)"},
          "60%":{ "transform":" translate3d(10px, 0, 0)"},
          "80%":{ "transform":" translate3d(10px, 0, 0)"},
        }
      }
    },
  },
  plugins: [],
};

export default config;