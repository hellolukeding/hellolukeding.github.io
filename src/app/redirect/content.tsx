import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface TipsProps {}

const Tips: React.FC<TipsProps> = (props) => {
  const [data, setData] = React.useState<any>(null);
  useEffect(() => {
    fetch("/json/site.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <section className="w-full h-full grid grid-cols-5 gap-y-7 justify-items-center  overflow-auto pb-10 dock-scroll">
      {data?.icons.map((item: any) => {
        return item.children.map((icon: any, index: number) => {
          if (icon.type === "site") {
            if (icon?.bgImage) {
              return (
                <div
                  key={icon.name + index}
                  className="flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => {
                    window.open(icon.target);
                  }}
                >
                  <img
                    src={icons[index % icons.length]}
                    alt="bg"
                    className="w-16 rounded-xl"
                  />
                  <p className="text-center mt-2 text-[0.8rem] w-18 break-words">
                    {icon?.name ? icon.name : icon.target}
                  </p>
                </div>
              );
            } else {
              return null;
            }
          } else if (icon.type === "folder-icon") {
          } else {
            return null;
          }
        });
      })}
    </section>
  );
};

const Dance: React.FC = () => {
  const router = useRouter();
  return (
    <section className="w-full h-full grid grid-cols-5 gap-y-7 justify-items-center  overflow-auto pb-10 dock-scroll">
      {dances.map((item) => {
        return (
          <div
            key={item.name}
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => {
              router.push(item.target);
            }}
          >
            <img src={item.icon} alt="bg" className="w-16 rounded-xl" />
            <p className="text-center mt-2 text-[0.8rem] w-18 break-words">
              {item.name}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export { Dance, Tips };

/*--------------------------------------- dance ------------------------------------------*/
interface DanceProps {
  name: string;
  icon: string;
  target: string;
}

const dances: DanceProps[] = [
  {
    name: "blog",
    icon:
      "https://i.pinimg.com/564x/1f/b4/9f/1fb49f437bbc0e1b80322845a1be366b.jpg",
    target: "/blog",
  },
];

/*--------------------------------------- icons ------------------------------------------*/
const icons = [
  "https://partyanimals.cn/media/avatars/avatars-1.png",
  "https://partyanimals.cn/media/avatars/avatars-2.png",
  "https://partyanimals.cn/media/avatars/avatars-3.png",
  "https://partyanimals.cn/media/avatars/avatars-4.png",
  "https://partyanimals.cn/media/avatars/avatars-5.png",
  "https://partyanimals.cn/media/avatars/avatars-6.png",
  "https://partyanimals.cn/media/avatars/avatars-8.png",
  "https://partyanimals.cn/media/avatars/avatars-9.png",
  "https://partyanimals.cn/media/avatars/avatars-10.png",
  "https://partyanimals.cn/media/avatars/avatars-11.png",
];
