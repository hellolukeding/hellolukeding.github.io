interface GlobalBgProps {
  children?: React.ReactNode;
}

const GlobalBg: React.FC<GlobalBgProps> = (props) => {
  return <main className="w-screen h-screen">{props.children}</main>;
};

export default GlobalBg;
