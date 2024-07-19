"use client";

import Lighting from "../Lighting";

interface GlobalBgProps {
  children?: React.ReactNode;
}

const GlobalBg: React.FC<GlobalBgProps> = (props) => {
  return (
    <main className="w-screen h-screen">
      <Lighting />
      {props.children}
    </main>
  );
};

export default GlobalBg;
