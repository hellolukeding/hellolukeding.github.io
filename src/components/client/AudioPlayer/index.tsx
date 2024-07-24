"use client";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useEffect, useRef } from "react";

interface AudioPlayerProps {
  src: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  const aRef = useRef<HTMLAudioElement>(null);
  const { toast, dismiss } = useToast();
  useEffect(() => {
    if (aRef.current) {
      setTimeout(() => {
        toast({
          title: "tips:",
          description: "需要打开海浪白噪吗？",
          action: (
            <ToastAction
              altText="打开白噪"
              onClick={() => {
                aRef.current!.muted = false;
                aRef.current!.play();
              }}
            >
              open
            </ToastAction>
          ),
          duration: 60000,
        });
      }, 1000);
    }
    return () => {
      dismiss();
    };
  }, []);
  return (
    <>
      <audio
        src={props.src}
        className={props.className}
        loop
        ref={aRef}
      ></audio>
    </>
  );
};

export default AudioPlayer;
