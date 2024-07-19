import alea from "alea";
import "client-only";
import { createNoise2D } from "simplex-noise";

export const lightingGenerate = async (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  segment: number,
  container: SVGPathElement
) => {
  const prng = alea("seed");
  const noise2D = createNoise2D(prng);
  const pathArr = [`M ${startX} ${startY}`];
  const stepx = (endX - startX) / segment;
  const stepy = (endY - startY) / segment;
  const drawBranch = (depth: number, progress: number) => {
    if (progress >= segment) return;
    const x = startX + stepx * progress;
    const y = startY + stepy * progress;
    const noise = noise2D(x / 100, y / 100);
    const angle = noise * Math.PI * 2;
    const length = depth * 10;
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;
    pathArr.push(`L ${endX} ${endY}`);
    drawBranch(depth + 1, progress + 1);
  };
  drawBranch(1, 0);
  container.setAttribute("d", pathArr.join(" "));
  return pathArr.join(" ");
};
