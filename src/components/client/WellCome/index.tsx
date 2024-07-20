"use client";

import { useEffect, useRef } from "react";
import Describe from "../Describe";
import { runShader } from "./render";

const WellCome: React.FC = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    runShader(canvasRef);
  }, []);
  return (
    <article className="w-full h-full relative flex items-center justify-center">
      <canvas className="w-full h-full absolute -z-10" ref={canvasRef}></canvas>
      <Describe />
    </article>
  );
};

export default WellCome;
