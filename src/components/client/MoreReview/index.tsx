"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MaterialSymbolsKeyboardArrowDown } from "./icons";

interface MoreReviewProps {}

const MoreReview: React.FC<MoreReviewProps> = (props) => {
  const router = useRouter();
  useEffect(() => {
    const moveDown = (e: Event) => {
      console.log("scroll");
      router.push("/redirect");
      window.removeEventListener("scroll", moveDown);
    };
    window.addEventListener("scroll", moveDown);
  }, []);
  return (
    <section
      onClick={() => {
        router.push("/redirect");
      }}
      className="fixed w-screen h-1/6 bottom-0 cursor-grab flex items-center justify-center"
    >
      <MaterialSymbolsKeyboardArrowDown className="text-6xl animate-moveDown" />
    </section>
  );
};

export default MoreReview;
