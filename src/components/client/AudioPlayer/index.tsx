"use client";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef } from "react";

interface AudioPlayerProps {
  src: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  const aRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  useEffect(() => {
    const audio = aRef.current;
    if (audio) {
      const handleCanPlayThrough = () => {
        // audio.muted = false;
        // audio.play();
        toast({
          title: "Audio is ready",
          description: "Audio is ready to play",
          action: <ToastAction>确定</ToastAction>,
        });
      };
      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      };
    }
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
