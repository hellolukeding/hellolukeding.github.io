import { lightingGenerate } from "@/utils/lightingGenerate";
import { useEffect, useRef } from "react";

interface LightingProps {}

const Lighting: React.FC<LightingProps> = (props) => {
  const pRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pRef.current) {
      lightingGenerate(
        0,
        0,
        window.innerWidth,
        window.innerHeight,
        Math.round(Math.random() * 200),
        pRef.current
      ).then((_) => {
        // console.log(pRef.current!.getTotalLength(), "total length");
        const path = pRef.current!;
        const length = path.getTotalLength();
        console.log(length, "length");
        path.style.strokeDasharray = length.toString();
        path.style.strokeDashoffset = length.toString();
        path.style.transition = `stroke-dashoffset ${Math.round(
          length / 1000
        )}s`;
      });
    }
  }, []);
  return (
    <svg className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none">
      <path
        ref={pRef}
        stroke="#f1faee"
        strokeOpacity={0.6}
        strokeWidth={1.5}
        fill="none"
      ></path>
    </svg>
  );
};

export default Lighting;
