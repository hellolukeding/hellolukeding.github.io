"use client";

import { useEffect, useRef } from "react";
import { runShader } from "./render";

const WellCome: React.FC = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    runShader(canvasRef);
  }, []);
  return (
    <article className="w-full h-full relative">
      <canvas className="w-full h-full -z-10" ref={canvasRef}></canvas>
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est accusantium
        numquam quibusdam similique asperiores consectetur! Assumenda
        perspiciatis neque quas, vel velit placeat, cum quos similique labore
        natus obcaecati provident veritatis.
      </p>
    </article>
  );
};

export default WellCome;
