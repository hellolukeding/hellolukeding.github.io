"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { Dance, Tips } from "./content";
import "./index.css";

export default function Home() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    console.log(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <section className="flex w-screen h-screen items-center justify-center redirect-bg">
      <article className=" w-8/12 h-5/6 rounded-2xl resize-x redirect-dock animate-shakeX flex flex-col items-center justify-center">
        <Carousel
          className="w-10/12 h-5/6 "
          opts={{
            dragFree: true,
            slidesToScroll: 1,
          }}
          setApi={setApi}
        >
          <CarouselContent>
            {titles.map((title, index) => (
              <CarouselItem key={index}>
                <div className=" w-full h-[35rem] flex flex-col rounded-2xl border border-white">
                  <h1 className=" text-center font-dance text-2xl leading-[5rem]">
                    {title}
                  </h1>
                  <section className="w-full h-[30rem]">
                    {title === "Dance" && <Dance />}
                    {title === "书签" && <Tips />}
                  </section>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <Progress className="w-4/12 mt-5" value={(current / 5) * 100} />
      </article>
    </section>
  );
}

const titles: string[] = ["Dance", "3D实验室", "书签", "工具集", "Music"];
