"use client";

import AudioPlayer from "../AudioPlayer";

interface DescribeProps {}

const Describe: React.FC<DescribeProps> = (props) => {
  return (
    <>
      <section className="w-7/12 h-4/6 rounded-lg p-5 pt-20 bg-opacity-80 backdrop-filter animate-fadeIn">
        <h1 className="text-4xl font-bold">{"LukeDing"}</h1>
        <p className="text-lg mt-5">
          {`
          I am a software engineer, and I am interested in web development, game development, and computer graphics.
          I am proficient in JavaScript, TypeScript,Dart,Go Lang and C#.This blog is my personal blog, and I will share some of my thoughts and experiences here.
          I hope you can find something useful here.
          If you have any questions, you can contact me through the contact information on the right.
          I am looking forward to your message.
          `}
        </p>
        <p className="text-right pt-20">
          {`
          --  LukeDing , ${new Date().getFullYear()}
          `}
        </p>
      </section>
      <AudioPlayer
        className="fixed left-5 bottom-5 z-10"
        src="/assets/audio/wave.mp3"
      />
    </>
  );
};

export default Describe;
