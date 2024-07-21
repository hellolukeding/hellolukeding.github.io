"use client";

interface StickerProps {}

const Sticker: React.FC<StickerProps> = (props) => {
  return (
    <footer className="w-full h-1/6  fixed bottom-0 left-0 z-10 animate-fadeIn">
      <div className="flex items-end justify-center h-full">
        {naviStickers.map((sticker, idx) => (
          <img
            key={sticker.img}
            src={sticker.img}
            alt={sticker.tooltip}
            className="h-full mx-5 hover:scale-125 transform transition-transform cursor-pointer"
            onClick={sticker.click2do}
          />
        ))}
      </div>
    </footer>
  );
};

export default Sticker;

interface NaviSticker {
  img: string;
  tooltip: string;
  click2do: () => void;
}

const naviStickers: NaviSticker[] = [
  {
    img: "/assets/imgs/cheem.png",
    tooltip: "博客",
    click2do: () => {},
  },
  {
    img: "/assets/imgs/kenny.png",
    tooltip: "3D实验室",
    click2do: () => {},
  },
  {
    img: "/assets/imgs/rawr.png",
    tooltip: "图床",
    click2do: () => {},
  },
  {
    img: "/assets/imgs/ah.png",
    tooltip: "音乐",
    click2do: () => {},
  },
  {
    img: "/assets/imgs/star.png",
    tooltip: "Carbon",
    click2do: () => {},
  },
  {
    img: "/assets/imgs/hannibal.png",
    tooltip: "竞技场",
    click2do: () => {},
  },
  {
    img: "/assets/imgs/bear.png",
    tooltip: "面试题",
    click2do: () => {},
  },
  {
    img: "/assets/imgs/boom.png",
    tooltip: "玩游戏",
    click2do: () => {},
  },
];
